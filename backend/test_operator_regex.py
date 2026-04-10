import re

def apply_operator(sql, param_name, new_operator):
    # Match any common operator before the param_name
    # Examples:
    # id = :id
    # name LIKE :name
    # date >= :start_date
    # Since SQL is case-insensitive, we use (?i) for text operators.
    # The regex looks for an operator followed by optional whitespace and :param_name
    
    # List of operators we might find in the SQL originally:
    # =, !=, <>, >, <, >=, <=, LIKE, IN
    
    # We want to replace it.
    
    # Simplified regex:
    # (\b(?:LIKE|IN|ILIKE)\b|[=<>!]+)\s*:{param_name}\b
    pattern = rf"(?i)(\b(?:LIKE|IN|ILIKE|IS)\b|[=<>!]+)\s*:{param_name}\b"
    
    def repl(m):
        return f"{new_operator} :{param_name}"
        
    return re.sub(pattern, repl, sql)

sqls = [
    "SELECT * FROM table WHERE id = :id",
    "SELECT * FROM table WHERE id =  :id",
    "SELECT * FROM table WHERE id != :id",
    "SELECT * FROM table WHERE id > :id",
    "SELECT * FROM table WHERE name LIKE :name",
    "SELECT * FROM table WHERE age >= :age AND status = 'active'"
]

for sql in sqls:
    print(apply_operator(sql, "id", "!="))
    print(apply_operator(sql, "id", "IN"))
    print(apply_operator(sql, "name", "="))
    print(apply_operator(sql, "age", "<"))
