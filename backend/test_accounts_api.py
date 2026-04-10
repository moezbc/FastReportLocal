import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth.models import User, Group
from accounts.views import UserViewSet, GroupViewSet

print("Starting backend test with DRF factory...")

try:
    Group.objects.get_or_create(name='Test Group 1')
    Group.objects.get_or_create(name='Test Group 2')
    
    admin, _ = User.objects.get_or_create(username='admin_test', email='admin@test.com', is_staff=True, is_superuser=True)
    admin.set_password('adminpass')
    admin.save()
    print("Test users created.")
except Exception as e:
    print(f"Db setup error: {e}")

factory = APIRequestFactory()
request = factory.get('/api/accounts/users/')
force_authenticate(request, user=admin)

# Test list users
view = UserViewSet.as_view({'get': 'list'})
response = view(request)
print(f"Users list status: {response.status_code}")
print(f"Users count: {len(response.data.get('results', response.data))}")

# Test create user with group
test_group = Group.objects.first()
post_data = {
    'username': 'new_user_via_api',
    'password': 'password123',
    'email': 'new@test.com',
    'first_name': 'New',
    'last_name': 'User',
    'group_ids': [test_group.id]
}
post_request = factory.post('/api/accounts/users/', data=post_data, format='json')
force_authenticate(post_request, user=admin)
create_view = UserViewSet.as_view({'post': 'create'})
create_response = create_view(post_request)
print(f"User create status: {create_response.status_code}")
if create_response.status_code == 201:
    print(f"Created user groups length: {len(create_response.data.get('groups', []))}")
else:
    print(f"Create error: {create_response.data}")

print("Backend test completed.")
