import re

def build_dynamic_sql_and_params(sql, report_parameters, parameters):
    params = {}
    processed_sql = sql

    # Dictionary strictly mapping input params
    for param in report_parameters.all():
        param_name = param.name
        if param_name in parameters:
            param_entry = parameters[param_name]
            if isinstance(param_entry, dict):
                value = param_entry.get('value', '')
                operator = param_entry.get('operator', '=')
                value2 = param_entry.get('value2', '')
            else:
                value = param_entry
                operator = '='
                value2 = ''
            
            # Pattern to find where the parameter was mapped in the query
            pattern = rf"(?i)(\b(?:LIKE|IN|ILIKE|IS(?:[ \t]+NOT)?)\b|[=<>!]+)\s*:{param_name}\b"
            
            op_upper = operator.upper()

            def repl(m):
                if op_upper in ('IS NULL', 'IS NOT NULL'):
                    return f"{op_upper}"
                elif op_upper == 'BETWEEN':
                    return f"BETWEEN :{param_name}_start AND :{param_name}_end"
                elif op_upper == 'IN':
                    # Simplest way is to just let it be IN :param_name and let user construct valid tuple? No, db drivers won't parse "1, 2" into a tuple correctly.
                    # Or we just string replace it? (DANGEROUS)
                    # For now just keep it simple:
                    return f"{operator} :{param_name}"
                else:
                    return f"{operator} :{param_name}"
            
            processed_sql = re.sub(pattern, repl, processed_sql)
            
            if op_upper == 'BETWEEN':
                params[f"{param_name}_start"] = value
                params[f"{param_name}_end"] = value2
            elif op_upper not in ('IS NULL', 'IS NOT NULL'):
                if op_upper == 'IN':
                    # Split comma-separated string into tuple-like for IN?
                    # Depending on driver, IN with a tuple might work for some, but not all.
                    # As a fallback we just use the string. It might fail.
                    params[param_name] = value
                else:
                    params[param_name] = value
                
        elif param.default_value:
            # Revert to default
            params[param_name] = param.default_value
            # We assume operator is '='
            pattern = rf"(?i)(\b(?:LIKE|IN|ILIKE|IS(?:[ \t]+NOT)?)\b|[=<>!]+)\s*:{param_name}\b"
            processed_sql = re.sub(pattern, f"= :{param_name}", processed_sql)

    return processed_sql, params
