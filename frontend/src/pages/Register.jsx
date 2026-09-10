import React, { useState } from 'react';
import { 
  Card, Form, Input, Button, Typography, Alert, 
  Divider, Select, Steps, message, Checkbox,
  Tag, Space, Spin
} from 'antd';
import { 
  UserOutlined, LockOutlined, MailOutlined, 
  PhoneOutlined, HomeOutlined, CheckCircleOutlined,
  ArrowRightOutlined, ArrowLeftOutlined,
  LoginOutlined, EyeOutlined, EyeInvisibleOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Step } = Steps;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    { title: 'Account', icon: <UserOutlined /> },
    { title: 'Profile', icon: <UserOutlined /> },
    { title: 'Verify', icon: <CheckCircleOutlined /> },
  ];

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(Math.min(strength, 5));
    
    // Check if passwords match when user types
    const confirmPassword = form.getFieldValue('confirmPassword');
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    const password = form.getFieldValue('password');
    
    if (password && password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'red';
    if (passwordStrength <= 2) return 'orange';
    if (passwordStrength <= 3) return 'gold';
    if (passwordStrength <= 4) return 'blue';
    return 'green';
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('📝 Registration values:', values);
      
      // Ensure passwords match before sending
      if (values.password !== values.confirmPassword) {
        message.error('Passwords do not match!');
        setLoading(false);
        return;
      }
      
      const response = await axios.post('http://localhost:8000/api/v1/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role || 'client',
        phone: values.phone || '',
        address: values.address || ''
      });

      console.log('✅ Registration response:', response.data);

      if (response.data.success) {
        setRegisterSuccess(true);
        setRegisteredUser(response.data.user);
        toast.success('Registration successful!');
        message.success('Account created successfully!');
        
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data);
      const errorMsg = error.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    try {
      // Validate only the fields in the current step
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log('Validation failed:', error);
      message.warning('Please fill in all required fields correctly');
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Success Page
  if (registerSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4">
        <Card className="w-full max-w-md shadow-2xl rounded-xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <Title level={2} className="text-green-600">Registration Successful!</Title>
          <Paragraph className="text-gray-600">
            Your account has been created successfully.
            {registeredUser?.role === 'client' && (
              <span className="block text-amber-600 mt-2">
                ⏳ Account pending approval. You will be notified once approved.
              </span>
            )}
          </Paragraph>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
            <p><strong>Username:</strong> {registeredUser?.username}</p>
            <p><strong>Email:</strong> {registeredUser?.email}</p>
            <p><strong>Role:</strong> {registeredUser?.role}</p>
            <p><strong>Status:</strong> {registeredUser?.status || 'Pending Approval'}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button 
              type="primary" 
              size="large" 
              block
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </div>
          <div className="mt-4 text-gray-400 text-sm">
            Redirecting to login in a moment...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-2xl shadow-2xl rounded-xl border-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">⚡</div>
          <Title level={2} className="text-blue-600 mb-1">EDSA</Title>
          <Text className="text-gray-500 text-lg">Management System</Text>
          <div className="mt-2 flex justify-center gap-2 flex-wrap">
            <Tag color="blue">Secure Registration</Tag>
            <Tag color="green">Free Account</Tag>
          </div>
        </div>

        {/* Steps */}
        <Steps current={currentStep} className="mb-8">
          {steps.map((step, index) => (
            <Step key={index} title={step.title} icon={step.icon} />
          ))}
        </Steps>

        {/* Registration Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: 'client' }}
        >
          {/* Step 1: Account Details */}
          <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Please enter a username' },
                { min: 3, message: 'Username must be at least 3 characters' },
                { max: 20, message: 'Username must be less than 20 characters' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Choose a username" 
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />} 
                placeholder="Enter your email" 
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter a password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="Create a strong password" 
                size="large"
                className="rounded-lg"
                onChange={handlePasswordChange}
                visibilityToggle={{ 
                  visible: showPassword, 
                  onVisibleChange: setShowPassword 
                }}
              />
            </Form.Item>

            {passwordStrength > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Password Strength:</span>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${(passwordStrength / 5) * 100}%`,
                          background: getPasswordStrengthColor()
                        }}
                      />
                    </div>
                  </div>
                  <Tag color={getPasswordStrengthColor()}>
                    {getPasswordStrengthText()}
                  </Tag>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Use uppercase, lowercase, numbers, and special characters for a strong password.
                </div>
              </div>
            )}

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const password = getFieldValue('password');
                    if (!value || password === value) {
                      setPasswordError(false);
                      return Promise.resolve();
                    }
                    setPasswordError(true);
                    return Promise.reject('Passwords do not match!');
                  }
                })
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="Confirm your password" 
                size="large"
                className="rounded-lg"
                onChange={handleConfirmPasswordChange}
                visibilityToggle={{ 
                  visible: showConfirmPassword, 
                  onVisibleChange: setShowConfirmPassword 
                }}
              />
            </Form.Item>
            
            {passwordError && (
              <div className="text-red-500 text-sm -mt-2 mb-4">
                <span>⚠️ Passwords do not match!</span>
              </div>
            )}
          </div>

          {/* Step 2: Profile Details */}
          <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Enter your full name" 
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="role"
              label="Register As"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select your role" size="large" className="rounded-lg">
                <Option value="client">👤 Client - Self Service Access</Option>
                <Option value="staff">👨‍💼 Staff - Operational Access</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
            >
              <Input 
                prefix={<PhoneOutlined className="text-gray-400" />} 
                placeholder="Enter your phone number" 
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
            >
              <Input 
                prefix={<HomeOutlined className="text-gray-400" />} 
                placeholder="Enter your address" 
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Alert
              message="Registration Approval"
              description={
                <span>
                  {form.getFieldValue('role') === 'client' 
                    ? 'Client accounts require admin approval before login.' 
                    : 'Staff accounts will be active immediately upon registration.'}
                </span>
              }
              type={form.getFieldValue('role') === 'client' ? 'warning' : 'info'}
              showIcon
              className="mb-4"
            />

            <Form.Item>
              <Checkbox 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)}
                className="text-gray-600"
              >
                I agree to the <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
              </Checkbox>
            </Form.Item>
          </div>

          {/* Step 3: Verification */}
          <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <Title level={3}>Almost Done!</Title>
              <Paragraph className="text-gray-500">
                Please review your information before creating your account.
              </Paragraph>

              <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="py-1"><strong>👤 Username:</strong> {form.getFieldValue('username')}</p>
                <p className="py-1"><strong>📧 Email:</strong> {form.getFieldValue('email')}</p>
                <p className="py-1"><strong>📛 Full Name:</strong> {form.getFieldValue('name')}</p>
                <p className="py-1"><strong>🔑 Role:</strong> {form.getFieldValue('role')}</p>
                {form.getFieldValue('phone') && (
                  <p className="py-1"><strong>📱 Phone:</strong> {form.getFieldValue('phone')}</p>
                )}
                {form.getFieldValue('address') && (
                  <p className="py-1"><strong>📍 Address:</strong> {form.getFieldValue('address')}</p>
                )}
              </div>

              <Alert
                message="Information Confirmation"
                description="Please verify all information is correct before proceeding."
                type="info"
                showIcon
                className="mt-4"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <Divider className="my-6" />
          <div className="flex justify-between items-center">
            {currentStep > 0 && (
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={prevStep}
                size="large"
                className="rounded-lg"
              >
                Back
              </Button>
            )}
            {currentStep < 2 ? (
              <Button 
                type="primary" 
                icon={<ArrowRightOutlined />} 
                onClick={nextStep}
                size="large"
                className="ml-auto rounded-lg shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
              >
                Next
              </Button>
            ) : (
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                loading={loading}
                icon={<CheckCircleOutlined />}
                className="ml-auto rounded-lg shadow-md shadow-green-500/20 hover:shadow-green-500/40 transition-all"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            )}
          </div>

          <Divider className="my-6">
            <span className="text-gray-400 text-sm">Already have an account?</span>
          </Divider>

          <div className="text-center">
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <LoginOutlined className="mr-1" />
              Sign In Here
            </Link>
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;