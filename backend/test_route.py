import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from reports.models import ReportExecution, Report
from launcher.tasks import route_output

# Create a mock report execution
report = Report.objects.first()
if not report:
    print("No report found")
    exit()

exec_obj = ReportExecution.objects.create(
    report=report,
    user=report.owner,
    parameters={},
    output_type='csv',
    routing_mode='email',
    routing_config={'recipients': ['test@example.com']},
    status='pending'
)

content = b"Mock Content A" * 1024 * 1024 # 14MB approx
try:
    print("Routing output...")
    route_output(exec_obj.id, 'email', {'recipients': ['test@test.com']}, content, 'test.csv', 'text/csv')
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
