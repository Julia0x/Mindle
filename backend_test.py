#!/usr/bin/env python3
"""
Backend Testing for Firebase-based Email Verification Authentication System

This test suite focuses on testing the Firebase integration aspects that serve as the "backend"
for this application, including:
- Firebase Auth operations
- Firestore data operations  
- Email verification flow
- Data integrity and validation
- User profile management
"""

import asyncio
import json
import time
import requests
from datetime import datetime
from typing import Dict, Any, Optional

class FirebaseAuthTester:
    """Test Firebase Authentication and Firestore operations"""
    
    def __init__(self):
        self.firebase_config = {
            "apiKey": "AIzaSyCxqQDcAIY28mj3KVPiBBOLwNLTi5lLRKE",
            "authDomain": "hhhh-1c48d.firebaseapp.com",
            "projectId": "hhhh-1c48d",
            "storageBucket": "hhhh-1c48d.firebasestorage.app",
            "messagingSenderId": "884366665443",
            "appId": "1:884366665443:web:213ca6c3db1fcf541447d6"
        }
        self.auth_url = f"https://identitytoolkit.googleapis.com/v1/accounts"
        self.firestore_url = f"https://firestore.googleapis.com/v1/projects/{self.firebase_config['projectId']}/databases/(default)/documents"
        self.api_key = self.firebase_config["apiKey"]
        
        # Test data
        self.test_email = f"test_user_{int(time.time())}@example.com"
        self.test_password = "TestPassword123!"
        self.test_user_data = {
            "firstName": "Test",
            "lastName": "User",
            "email": self.test_email
        }
        
        self.test_results = []
        self.user_id_token = None
        self.user_uid = None

    def log_test(self, test_name: str, success: bool, message: str, details: Optional[Dict] = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {json.dumps(details, indent=2)}")

    def test_firebase_config(self):
        """Test Firebase configuration validity"""
        try:
            required_fields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
            missing_fields = [field for field in required_fields if not self.firebase_config.get(field)]
            
            if missing_fields:
                self.log_test(
                    "Firebase Configuration",
                    False,
                    f"Missing required fields: {missing_fields}"
                )
                return False
            
            # Test API key validity by making a simple request
            response = requests.get(
                f"{self.auth_url}:lookup?key={self.api_key}",
                json={"idToken": "invalid_token"}
            )
            
            # Should return 400 for invalid token, not 403 for invalid API key
            if response.status_code == 403:
                self.log_test(
                    "Firebase Configuration",
                    False,
                    "Invalid API key"
                )
                return False
            
            self.log_test(
                "Firebase Configuration",
                True,
                "Firebase configuration is valid",
                {"config": self.firebase_config}
            )
            return True
            
        except Exception as e:
            self.log_test(
                "Firebase Configuration",
                False,
                f"Configuration test failed: {str(e)}"
            )
            return False

    def test_user_registration(self):
        """Test user registration with Firebase Auth"""
        try:
            # Register user
            register_data = {
                "email": self.test_email,
                "password": self.test_password,
                "returnSecureToken": True
            }
            
            response = requests.post(
                f"{self.auth_url}:signUp?key={self.api_key}",
                json=register_data
            )
            
            if response.status_code != 200:
                self.log_test(
                    "User Registration",
                    False,
                    f"Registration failed: {response.text}",
                    {"status_code": response.status_code}
                )
                return False
            
            data = response.json()
            self.user_id_token = data.get("idToken")
            self.user_uid = data.get("localId")
            
            if not self.user_id_token or not self.user_uid:
                self.log_test(
                    "User Registration",
                    False,
                    "Registration response missing required fields"
                )
                return False
            
            self.log_test(
                "User Registration",
                True,
                "User registered successfully",
                {
                    "email": self.test_email,
                    "uid": self.user_uid,
                    "emailVerified": data.get("emailVerified", False)
                }
            )
            return True
            
        except Exception as e:
            self.log_test(
                "User Registration",
                False,
                f"Registration test failed: {str(e)}"
            )
            return False

    def test_email_verification_sending(self):
        """Test sending email verification"""
        try:
            if not self.user_id_token:
                self.log_test(
                    "Email Verification Sending",
                    False,
                    "No user token available for verification test"
                )
                return False
            
            verification_data = {
                "requestType": "VERIFY_EMAIL",
                "idToken": self.user_id_token
            }
            
            response = requests.post(
                f"{self.auth_url}:sendOobCode?key={self.api_key}",
                json=verification_data
            )
            
            if response.status_code != 200:
                self.log_test(
                    "Email Verification Sending",
                    False,
                    f"Failed to send verification email: {response.text}",
                    {"status_code": response.status_code}
                )
                return False
            
            data = response.json()
            self.log_test(
                "Email Verification Sending",
                True,
                "Verification email sent successfully",
                {
                    "email": data.get("email"),
                    "kind": data.get("kind")
                }
            )
            return True
            
        except Exception as e:
            self.log_test(
                "Email Verification Sending",
                False,
                f"Email verification test failed: {str(e)}"
            )
            return False

    def test_user_profile_creation(self):
        """Test creating user profile in Firestore"""
        try:
            if not self.user_id_token or not self.user_uid:
                self.log_test(
                    "User Profile Creation",
                    False,
                    "No user credentials available for profile creation test"
                )
                return False
            
            # Create user profile document
            profile_data = {
                "fields": {
                    "uid": {"stringValue": self.user_uid},
                    "email": {"stringValue": self.test_email},
                    "firstName": {"stringValue": self.test_user_data["firstName"]},
                    "lastName": {"stringValue": self.test_user_data["lastName"]},
                    "verified": {"booleanValue": False},
                    "credits": {"integerValue": "100"},
                    "isPro": {"booleanValue": False},
                    "isAdmin": {"booleanValue": False},
                    "totalServers": {"integerValue": "0"},
                    "createdAt": {"timestampValue": datetime.now().isoformat() + "Z"},
                    "updatedAt": {"timestampValue": datetime.now().isoformat() + "Z"}
                }
            }
            
            response = requests.post(
                f"{self.firestore_url}/users/{self.user_uid}",
                json=profile_data,
                headers={"Authorization": f"Bearer {self.user_id_token}"}
            )
            
            if response.status_code not in [200, 201]:
                self.log_test(
                    "User Profile Creation",
                    False,
                    f"Failed to create user profile: {response.text}",
                    {"status_code": response.status_code}
                )
                return False
            
            self.log_test(
                "User Profile Creation",
                True,
                "User profile created successfully in Firestore",
                {"uid": self.user_uid, "email": self.test_email}
            )
            return True
            
        except Exception as e:
            self.log_test(
                "User Profile Creation",
                False,
                f"Profile creation test failed: {str(e)}"
            )
            return False

    def test_user_profile_retrieval(self):
        """Test retrieving user profile from Firestore"""
        try:
            if not self.user_id_token or not self.user_uid:
                self.log_test(
                    "User Profile Retrieval",
                    False,
                    "No user credentials available for profile retrieval test"
                )
                return False
            
            response = requests.get(
                f"{self.firestore_url}/users/{self.user_uid}",
                headers={"Authorization": f"Bearer {self.user_id_token}"}
            )
            
            if response.status_code != 200:
                self.log_test(
                    "User Profile Retrieval",
                    False,
                    f"Failed to retrieve user profile: {response.text}",
                    {"status_code": response.status_code}
                )
                return False
            
            data = response.json()
            fields = data.get("fields", {})
            
            # Validate required fields
            required_fields = ["uid", "email", "firstName", "lastName", "verified", "credits"]
            missing_fields = [field for field in required_fields if field not in fields]
            
            if missing_fields:
                self.log_test(
                    "User Profile Retrieval",
                    False,
                    f"Profile missing required fields: {missing_fields}"
                )
                return False
            
            self.log_test(
                "User Profile Retrieval",
                True,
                "User profile retrieved successfully",
                {
                    "uid": fields.get("uid", {}).get("stringValue"),
                    "email": fields.get("email", {}).get("stringValue"),
                    "verified": fields.get("verified", {}).get("booleanValue"),
                    "credits": fields.get("credits", {}).get("integerValue")
                }
            )
            return True
            
        except Exception as e:
            self.log_test(
                "User Profile Retrieval",
                False,
                f"Profile retrieval test failed: {str(e)}"
            )
            return False

    def test_user_login(self):
        """Test user login with Firebase Auth"""
        try:
            login_data = {
                "email": self.test_email,
                "password": self.test_password,
                "returnSecureToken": True
            }
            
            response = requests.post(
                f"{self.auth_url}:signInWithPassword?key={self.api_key}",
                json=login_data
            )
            
            if response.status_code != 200:
                self.log_test(
                    "User Login",
                    False,
                    f"Login failed: {response.text}",
                    {"status_code": response.status_code}
                )
                return False
            
            data = response.json()
            login_token = data.get("idToken")
            
            if not login_token:
                self.log_test(
                    "User Login",
                    False,
                    "Login response missing ID token"
                )
                return False
            
            self.log_test(
                "User Login",
                True,
                "User login successful",
                {
                    "email": data.get("email"),
                    "emailVerified": data.get("emailVerified", False),
                    "uid": data.get("localId")
                }
            )
            return True
            
        except Exception as e:
            self.log_test(
                "User Login",
                False,
                f"Login test failed: {str(e)}"
            )
            return False

    def test_verification_status_sync(self):
        """Test verification status synchronization between Firebase Auth and Firestore"""
        try:
            if not self.user_id_token or not self.user_uid:
                self.log_test(
                    "Verification Status Sync",
                    False,
                    "No user credentials available for sync test"
                )
                return False
            
            # Get current auth status
            auth_response = requests.post(
                f"{self.auth_url}:lookup?key={self.api_key}",
                json={"idToken": self.user_id_token}
            )
            
            if auth_response.status_code != 200:
                self.log_test(
                    "Verification Status Sync",
                    False,
                    f"Failed to get auth status: {auth_response.text}"
                )
                return False
            
            auth_data = auth_response.json()
            auth_verified = auth_data.get("users", [{}])[0].get("emailVerified", False)
            
            # Get Firestore profile status
            profile_response = requests.get(
                f"{self.firestore_url}/users/{self.user_uid}",
                headers={"Authorization": f"Bearer {self.user_id_token}"}
            )
            
            if profile_response.status_code != 200:
                self.log_test(
                    "Verification Status Sync",
                    False,
                    f"Failed to get profile status: {profile_response.text}"
                )
                return False
            
            profile_data = profile_response.json()
            profile_verified = profile_data.get("fields", {}).get("verified", {}).get("booleanValue", False)
            
            # Check if statuses match (they should both be False for new users)
            if auth_verified != profile_verified:
                self.log_test(
                    "Verification Status Sync",
                    False,
                    f"Verification status mismatch: Auth={auth_verified}, Profile={profile_verified}"
                )
                return False
            
            self.log_test(
                "Verification Status Sync",
                True,
                "Verification status synchronized correctly",
                {
                    "auth_verified": auth_verified,
                    "profile_verified": profile_verified
                }
            )
            return True
            
        except Exception as e:
            self.log_test(
                "Verification Status Sync",
                False,
                f"Verification sync test failed: {str(e)}"
            )
            return False

    def test_server_creation_data_integrity(self):
        """Test server creation with proper data validation"""
        try:
            if not self.user_id_token or not self.user_uid:
                self.log_test(
                    "Server Creation Data Integrity",
                    False,
                    "No user credentials available for server creation test"
                )
                return False
            
            # Create a test server document
            server_data = {
                "fields": {
                    "id": {"stringValue": f"server_{int(time.time())}"},
                    "name": {"stringValue": "Test Server"},
                    "description": {"stringValue": "Test server for validation"},
                    "ownerId": {"stringValue": self.user_uid},
                    "aiPrompt": {"stringValue": "Create a gaming community server"},
                    "theme": {"stringValue": "Gaming"},
                    "purpose": {"stringValue": "Community"},
                    "targetAudience": {"stringValue": "Gamers"},
                    "memberCount": {"integerValue": "1"},
                    "channelCount": {"integerValue": "5"},
                    "roleCount": {"integerValue": "3"},
                    "isPublic": {"booleanValue": True},
                    "region": {"stringValue": "us-west"},
                    "boostLevel": {"integerValue": "0"},
                    "createdAt": {"timestampValue": datetime.now().isoformat() + "Z"},
                    "updatedAt": {"timestampValue": datetime.now().isoformat() + "Z"},
                    "roles": {"arrayValue": {"values": []}},
                    "categories": {"arrayValue": {"values": []}},
                    "channels": {"arrayValue": {"values": []}},
                    "tags": {"arrayValue": {"values": []}},
                    "settings": {
                        "mapValue": {
                            "fields": {
                                "verificationLevel": {"stringValue": "medium"},
                                "defaultNotifications": {"stringValue": "only_mentions"},
                                "explicitContentFilter": {"stringValue": "members_without_roles"},
                                "afkTimeout": {"integerValue": "300"}
                            }
                        }
                    }
                }
            }
            
            # Test server creation
            response = requests.post(
                f"{self.firestore_url}/servers",
                json=server_data,
                headers={"Authorization": f"Bearer {self.user_id_token}"}
            )
            
            if response.status_code not in [200, 201]:
                self.log_test(
                    "Server Creation Data Integrity",
                    False,
                    f"Failed to create server: {response.text}",
                    {"status_code": response.status_code}
                )
                return False
            
            created_server = response.json()
            server_id = created_server.get("name", "").split("/")[-1]
            
            # Validate no undefined fields in response
            def check_for_undefined(obj, path=""):
                if isinstance(obj, dict):
                    for key, value in obj.items():
                        if value is None:
                            return f"{path}.{key}" if path else key
                        result = check_for_undefined(value, f"{path}.{key}" if path else key)
                        if result:
                            return result
                elif isinstance(obj, list):
                    for i, item in enumerate(obj):
                        result = check_for_undefined(item, f"{path}[{i}]")
                        if result:
                            return result
                return None
            
            undefined_field = check_for_undefined(created_server)
            if undefined_field:
                self.log_test(
                    "Server Creation Data Integrity",
                    False,
                    f"Server contains undefined field: {undefined_field}"
                )
                return False
            
            self.log_test(
                "Server Creation Data Integrity",
                True,
                "Server created with proper data integrity",
                {
                    "server_id": server_id,
                    "owner_id": self.user_uid,
                    "has_required_fields": True
                }
            )
            return True
            
        except Exception as e:
            self.log_test(
                "Server Creation Data Integrity",
                False,
                f"Server creation test failed: {str(e)}"
            )
            return False

    def test_protected_route_logic(self):
        """Test protected route authentication logic"""
        try:
            # Test 1: No user token (should fail)
            test_cases = [
                {
                    "name": "No Authentication",
                    "token": None,
                    "should_pass": False,
                    "description": "Unauthenticated user should be blocked"
                },
                {
                    "name": "Valid Token, Unverified Email",
                    "token": self.user_id_token,
                    "should_pass": False,
                    "description": "Authenticated but unverified user should be redirected to verification"
                }
            ]
            
            all_passed = True
            results = []
            
            for test_case in test_cases:
                try:
                    # Simulate protected route check by trying to access user profile
                    headers = {}
                    if test_case["token"]:
                        headers["Authorization"] = f"Bearer {test_case['token']}"
                    
                    response = requests.get(
                        f"{self.firestore_url}/users/{self.user_uid}",
                        headers=headers
                    )
                    
                    # For no token, should get 401/403
                    # For valid token but unverified, should get 200 but verification status should be False
                    if test_case["name"] == "No Authentication":
                        passed = response.status_code in [401, 403]
                    else:
                        if response.status_code == 200:
                            data = response.json()
                            verified = data.get("fields", {}).get("verified", {}).get("booleanValue", False)
                            passed = not verified  # Should be unverified
                        else:
                            passed = False
                    
                    results.append({
                        "test": test_case["name"],
                        "passed": passed,
                        "description": test_case["description"],
                        "status_code": response.status_code
                    })
                    
                    if not passed:
                        all_passed = False
                        
                except Exception as e:
                    results.append({
                        "test": test_case["name"],
                        "passed": False,
                        "description": f"Test failed with error: {str(e)}",
                        "status_code": None
                    })
                    all_passed = False
            
            self.log_test(
                "Protected Route Logic",
                all_passed,
                "Protected route authentication logic validated" if all_passed else "Some protected route tests failed",
                {"test_results": results}
            )
            return all_passed
            
        except Exception as e:
            self.log_test(
                "Protected Route Logic",
                False,
                f"Protected route test failed: {str(e)}"
            )
            return False

    def cleanup_test_data(self):
        """Clean up test data"""
        try:
            if self.user_id_token and self.user_uid:
                # Delete user account
                delete_response = requests.post(
                    f"{self.auth_url}:delete?key={self.api_key}",
                    json={"idToken": self.user_id_token}
                )
                
                if delete_response.status_code == 200:
                    print(f"✅ Cleaned up test user: {self.test_email}")
                else:
                    print(f"⚠️  Failed to clean up test user: {delete_response.text}")
                    
        except Exception as e:
            print(f"⚠️  Cleanup error: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Firebase Backend Authentication System Tests")
        print("=" * 60)
        
        tests = [
            self.test_firebase_config,
            self.test_user_registration,
            self.test_email_verification_sending,
            self.test_user_profile_creation,
            self.test_user_profile_retrieval,
            self.test_user_login,
            self.test_verification_status_sync,
            self.test_server_creation_data_integrity,
            self.test_protected_route_logic
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            try:
                if test():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ Test {test.__name__} crashed: {str(e)}")
                failed += 1
            
            print("-" * 40)
        
        # Cleanup
        self.cleanup_test_data()
        
        print("\n📊 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Critical issues summary
        critical_issues = [result for result in self.test_results if not result["success"]]
        if critical_issues:
            print("\n🚨 CRITICAL ISSUES FOUND:")
            for issue in critical_issues:
                print(f"   • {issue['test']}: {issue['message']}")
        else:
            print("\n🎉 All backend authentication tests passed!")
        
        return {
            "total_tests": len(tests),
            "passed": passed,
            "failed": failed,
            "success_rate": passed/(passed+failed)*100 if (passed+failed) > 0 else 0,
            "critical_issues": critical_issues,
            "test_results": self.test_results
        }

def main():
    """Main test execution"""
    tester = FirebaseAuthTester()
    results = tester.run_all_tests()
    
    # Save detailed results
    with open("/app/backend_test_results.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    # Return exit code based on results
    return 0 if results["failed"] == 0 else 1

if __name__ == "__main__":
    exit(main())