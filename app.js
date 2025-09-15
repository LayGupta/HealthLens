// HealthLens - App.js
// Main JavaScript file for HealthLens application

// Global Variables
let currentTestimonial = 0;
let currentUser = null;
let charts = {};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    initializeNavigationHandlers();
    initializeAuthenticationHandlers();
    initializeFormHandlers();
    initializeDashboard();
    initializeTestimonials();
    initializeSmoothScrolling();
    initializeAnimations();
    checkAuthStatus();
}

// Page Navigation Functions
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update navigation active states
        updateNavigationActiveState(pageId);
        
        // Initialize page-specific content
        initializePageContent(pageId);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
}

function updateNavigationActiveState(activePageId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(activePageId)) {
            link.classList.add('active');
        }
    });
}

function initializePageContent(pageId) {
    switch(pageId) {
        case 'dashboard':
            initializeDashboardCharts();
            updateDashboardData();
            break;
        case 'about':
            scrollToSection('how-it-works');
            break;
        default:
            break;
    }
}

// Navigation Event Handlers
function initializeNavigationHandlers() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for anchor links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            scrollToSection(targetId);
        }
    });
    
    // User menu toggle
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', toggleUserMenu);
    }
    
    // Close user menu when clicking outside
    document.addEventListener('click', function(e) {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu && !userMenu.contains(e.target)) {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        }
    });
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('show');
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Authentication Functions
function initializeAuthenticationHandlers() {
    // Sign in form
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }
    
    // Sign up form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUp);
    }
    
    // Password strength checker
    const signupPassword = document.getElementById('signup-password');
    if (signupPassword) {
        signupPassword.addEventListener('input', checkPasswordStrength);
    }
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    // Update tabs
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.auth-tab:nth-child(${tabName === 'signin' ? '1' : '2'})`).classList.add('active');
    
    // Update forms
    forms.forEach(form => form.classList.remove('active'));
    document.getElementById(`${tabName}-form`).classList.add('active');
    
    // Update header text
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    
    if (tabName === 'signin') {
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Sign in to continue your health journey';
    } else {
        title.textContent = 'Join HealthLens';
        subtitle.textContent = 'Create your account to get started';
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('signup-password').value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    let strengthLabel = 'Very Weak';
    
    // Check password criteria
    if (password.length >= 8) strength += 20;
    if (password.match(/[a-z]/)) strength += 20;
    if (password.match(/[A-Z]/)) strength += 20;
    if (password.match(/[0-9]/)) strength += 20;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 20;
    
    // Update strength label
    if (strength >= 80) strengthLabel = 'Strong';
    else if (strength >= 60) strengthLabel = 'Good';
    else if (strength >= 40) strengthLabel = 'Fair';
    else if (strength >= 20) strengthLabel = 'Weak';
    
    // Update UI
    strengthBar.style.width = strength + '%';
    strengthText.textContent = `Password strength: ${strengthLabel}`;
    
    // Update color
    if (strength >= 80) strengthBar.style.background = '#81C784';
    else if (strength >= 60) strengthBar.style.background = '#FFEE58';
    else if (strength >= 40) strengthBar.style.background = '#FFB74D';
    else strengthBar.style.background = '#FF7043';
}

async function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const remember = document.querySelector('input[name="remember"]').checked;
    
    showLoading();
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock successful login
        const userData = {
            id: 1,
            name: 'John Doe',
            email: email,
            joinDate: new Date().toISOString()
        };
        
        setCurrentUser(userData);
        
        if (remember) {
            localStorage.setItem('healthlens_user', JSON.stringify(userData));
        }
        
        showSuccessMessage('Welcome back! Redirecting to dashboard...');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        showErrorMessage('Invalid email or password. Please try again.');
    } finally {
        hideLoading();
    }
}

async function handleSignUp(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.querySelector('input[name="terms"]').checked;
    
    // Validation
    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match.');
        return;
    }
    
    if (!terms) {
        showErrorMessage('Please accept the Terms of Service and Privacy Policy.');
        return;
    }
    
    showLoading();
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock successful registration
        const userData = {
            id: Date.now(),
            name: name,
            email: email,
            joinDate: new Date().toISOString()
        };
        
        setCurrentUser(userData);
        localStorage.setItem('healthlens_user', JSON.stringify(userData));
        
        showSuccessMessage('Account created successfully! Redirecting to assessment...');
        
        setTimeout(() => {
            window.location.href = 'assessment.html';
        }, 1500);
        
    } catch (error) {
        showErrorMessage('Registration failed. Please try again.');
    } finally {
        hideLoading();
    }
}

function signInWith(provider) {
    showLoading();
    
    // Simulate social sign-in
    setTimeout(() => {
        const userData = {
            id: Date.now(),
            name: `User from ${provider}`,
            email: `user@${provider}.com`,
            joinDate: new Date().toISOString(),
            provider: provider
        };
        
        setCurrentUser(userData);
        localStorage.setItem('healthlens_user', JSON.stringify(userData));
        
        showSuccessMessage(`Signed in with ${provider}! Redirecting...`);
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
        hideLoading();
    }, 1500);
}

function handleSignOut() {
    currentUser = null;
    localStorage.removeItem('healthlens_user');
    sessionStorage.removeItem('healthlens_session');
    showSuccessMessage('Signed out successfully!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('healthlens_user');
    if (savedUser) {
        try {
            setCurrentUser(JSON.parse(savedUser));
        } catch (error) {
            console.error('Error parsing saved user data:', error);
            localStorage.removeItem('healthlens_user');
        }
    }
}

function setCurrentUser(user) {
    currentUser = user;
    updateUIForAuthenticatedUser();
}

function updateUIForAuthenticatedUser() {
    if (currentUser) {
        // Update welcome message
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${currentUser.name}!`;
        }
        
        // Update user avatar
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }
    }
}

// Form Handling Functions
function initializeFormHandlers() {
    // Assessment form
    const assessmentForm = document.getElementById('assessmentForm');
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', handleAssessmentSubmission);
    }
    
    // BMI calculation
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    if (weightInput && heightInput) {
        weightInput.addEventListener('input', calculateBMI);
        heightInput.addEventListener('input', calculateBMI);
    }
    
    // Stress level slider
    const stressSlider = document.getElementById('stress');
    if (stressSlider) {
        stressSlider.addEventListener('input', function() {
            updateStressValue(this.value);
        });
    }
}

function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to m
    
    if (weight && height && weight > 0 && height > 0) {
        const bmi = weight / (height * height);
        const bmiField = document.getElementById('bmi');
        if (bmiField) {
            bmiField.value = bmi.toFixed(1);
        }
        
        // Show BMI category
        showBMICategory(bmi);
    }
}

function showBMICategory(bmi) {
    let category = '';
    let color = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#FF7043';
    } else if (bmi < 25) {
        category = 'Normal weight';
        color = '#81C784';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = '#FFEE58';
    } else {
        category = 'Obese';
        color = '#FF7043';
    }
    
    // Create or update BMI indicator
    let indicator = document.getElementById('bmi-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'bmi-indicator';
        indicator.style.cssText = `
            margin-top: 0.5rem;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
            font-weight: 600;
        `;
        document.getElementById('height').parentNode.appendChild(indicator);
    }
    
    indicator.textContent = `BMI: ${bmi.toFixed(1)} (${category})`;
    indicator.style.backgroundColor = color;
    indicator.style.color = bmi < 25 && bmi >= 18.5 ? 'white' : '#2E3A3F';
}

function updateStressValue(value) {
    const stressValue = document.getElementById('stressValue');
    if (stressValue) {
        stressValue.textContent = value;
    }
}

async function handleAssessmentSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const assessmentData = Object.fromEntries(formData.entries());
    
    // Add calculated BMI
    const weight = parseFloat(assessmentData.weight);
    const height = parseFloat(assessmentData.height) / 100;
    if (weight && height) {
        assessmentData.bmi = (weight / (height * height)).toFixed(1);
    }
    
    // Add timestamp
    assessmentData.timestamp = new Date().toISOString();
    assessmentData.userId = currentUser?.id || 'anonymous';
    
    showLoading();
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Save assessment data
        localStorage.setItem('healthlens_assessment', JSON.stringify(assessmentData));
        
        showSuccessMessage('Assessment completed successfully! Redirecting to dashboard...');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        showErrorMessage('Failed to submit assessment. Please try again.');
    } finally {
        hideLoading();
    }
}

// Dashboard Functions
function initializeDashboard() {
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardData();
        initializeDashboardCharts();
    }
}

function loadDashboardData() {
    const assessmentData = localStorage.getItem('healthlens_assessment');
    if (assessmentData) {
        try {
            const data = JSON.parse(assessmentData);
            updateDashboardWithAssessmentData(data);
        } catch (error) {
            console.error('Error loading assessment data:', error);
        }
    }
}

function updateDashboardWithAssessmentData(data) {
    // Update risk scores based on assessment
    updateRiskScores(data);
    
    // Update recommendations
    updateRecommendations(data);
    
    // Update progress tracking
    updateProgressTracking(data);
}

function updateRiskScores(data) {
    // Simple risk calculation based on assessment data
    let diabetesRisk = 30;
    let hypertensionRisk = 25;
    let heartDiseaseRisk = 20;
    
    // Adjust based on age
    if (data.age > 45) {
        diabetesRisk += 15;
        hypertensionRisk += 20;
        heartDiseaseRisk += 10;
    }
    
    // Adjust based on BMI
    const bmi = parseFloat(data.bmi);
    if (bmi > 30) {
        diabetesRisk += 20;
        hypertensionRisk += 15;
        heartDiseaseRisk += 15;
    } else if (bmi > 25) {
        diabetesRisk += 10;
        hypertensionRisk += 8;
        heartDiseaseRisk += 5;
    }
    
    // Adjust based on glucose levels
    const glucose = parseFloat(data.glucose);
    if (glucose > 126) {
        diabetesRisk += 30;
    } else if (glucose > 100) {
        diabetesRisk += 15;
    }
    
    // Update UI
    const riskItems = document.querySelectorAll('.risk-item');
    if (riskItems.length >= 3) {
        updateRiskItem(riskItems[0], 'Diabetes Risk', Math.min(diabetesRisk, 85));
        updateRiskItem(riskItems[1], 'Hypertension Risk', Math.min(hypertensionRisk, 75));
        updateRiskItem(riskItems[2], 'Heart Disease Risk', Math.min(heartDiseaseRisk, 65));
    }
}

function updateRiskItem(element, label, percentage) {
    const span = element.querySelector('span:last-child');
    let riskLevel = 'Low';
    let riskClass = 'risk-low';
    
    if (percentage >= 60) {
        riskLevel = 'High';
        riskClass = 'risk-high';
    } else if (percentage >= 40) {
        riskLevel = 'Moderate';
        riskClass = 'risk-moderate';
    }
    
    span.className = `risk-level ${riskClass}`;
    span.textContent = `${riskLevel} (${percentage}%)`;
}

function updateRecommendations(data) {
    // This would typically be done by AI analysis
    // For demo purposes, we'll show static recommendations
    console.log('Recommendations updated based on assessment data');
}

function updateProgressTracking(data) {
    // Update progress metrics
    const metrics = {
        glucose: data.glucose || 125,
        bloodPressure: data.bloodPressure || '129/84',
        weight: data.weight || 73.9,
        activity: 5200
    };
    
    // Update metric info displays
    updateMetricInfo('Latest glucose:', `${metrics.glucose} mg/dL`);
    updateMetricInfo('Latest BP:', `${metrics.bloodPressure} mmHg`);
    updateMetricInfo('Current weight:', `${metrics.weight} kg`);
    updateMetricInfo('Weekly avg steps:', `${metrics.activity} steps/day`);
}

function updateMetricInfo(label, value) {
    const metricInfos = document.querySelectorAll('.metric-info');
    metricInfos.forEach(info => {
        if (info.textContent.includes(label.split(':')[0])) {
            info.textContent = `${label} ${value}`;
        }
    });
}

// Chart Initialization
function initializeDashboardCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded, skipping chart initialization');
        return;
    }
    
    initializeRiskChart();
    initializeGlucoseChart();
    initializeBPChart();
    initializeWeightChart();
    initializeActivityChart();
}

function initializeRiskChart() {
    const ctx = document.getElementById('riskChart');
    if (!ctx) return;
    
    charts.riskChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Diabetes Risk', 'Hypertension Risk', 'Heart Disease Risk', 'Healthy'],
            datasets: [{
                data: [65, 45, 30, 60],
                backgroundColor: ['#FFEE58', '#FF7043', '#BDBDBD', '#81C784'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function initializeGlucoseChart() {
    const ctx = document.getElementById('glucoseChart');
    if (!ctx) return;
    
    const glucoseData = generateMockTimeSeriesData(125, 10, 7);
    
    charts.glucoseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(7),
            datasets: [{
                label: 'Glucose (mg/dL)',
                data: glucoseData,
                borderColor: '#4FC3F7',
                backgroundColor: 'rgba(79, 195, 247, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 100,
                    max: 150
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function initializeBPChart() {
    const ctx = document.getElementById('bpChart');
    if (!ctx) return;
    
    const systolicData = generateMockTimeSeriesData(129, 8, 7);
    const diastolicData = generateMockTimeSeriesData(84, 5, 7);
    
    charts.bpChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(7),
            datasets: [{
                label: 'Systolic',
                data: systolicData,
                borderColor: '#FF7043',
                backgroundColor: 'rgba(255, 112, 67, 0.1)',
                tension: 0.4
            }, {
                label: 'Diastolic',
                data: diastolicData,
                borderColor: '#26A69A',
                backgroundColor: 'rgba(38, 166, 154, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function initializeWeightChart() {
    const ctx = document.getElementById('weightChart');
    if (!ctx) return;
    
    const weightData = generateMockTimeSeriesData(73.9, 2, 30);
    
    charts.weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: 'Weight (kg)',
                data: weightData,
                borderColor: '#81C784',
                backgroundColor: 'rgba(129, 199, 132, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function initializeActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    const activityData = generateMockTimeSeriesData(5200, 1500, 7);
    
    charts.activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Steps',
                data: activityData,
                backgroundColor: '#FFEE58',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Utility Functions for Charts
function generateMockTimeSeriesData(baseValue, variance, points) {
    const data = [];
    for (let i = 0; i < points; i++) {
        const randomOffset = (Math.random() - 0.5) * variance * 2;
        data.push(Math.round((baseValue + randomOffset) * 10) / 10);
    }
    return data;
}

function generateDateLabels(days) {
    const labels = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
}

// Testimonials Functions
function initializeTestimonials() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    if (testimonialSlides.length > 0) {
        // Auto-rotate testimonials
        setInterval(nextTestimonial, 8000);
    }
}

function nextTestimonial() {
    const testimonials = document.querySelectorAll('.testimonial-slide');
    if (testimonials.length === 0) return;
    
    testimonials[currentTestimonial].classList.remove('active');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.add('active');
}

function prevTestimonial() {
    const testimonials = document.querySelectorAll('.testimonial-slide');
    if (testimonials.length === 0) return;
    
    testimonials[currentTestimonial].classList.remove('active');
    currentTestimonial = currentTestimonial === 0 ? testimonials.length - 1 : currentTestimonial - 1;
    testimonials[currentTestimonial].classList.add('active');
}

// Smooth Scrolling and Animations
function initializeSmoothScrolling() {
    // Add smooth scrolling behavior to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .step-card, .stat-card, .testimonial-slide');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Reports Functions
function generateReport(reportType) {
    showLoading();
    
    setTimeout(() => {
        let reportData = {};
        
        switch(reportType) {
            case 'monthly':
                reportData = generateMonthlyReport();
                break;
            case 'risk':
                reportData = generateRiskReport();
                break;
            case 'progress':
                reportData = generateProgressReport();
                break;
        }
        
        downloadReport(reportData, reportType);
        hideLoading();
        showSuccessMessage(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`);
    }, 2000);
}

function generateMonthlyReport() {
    return {
        type: 'Monthly Health Summary',
        period: 'Last 30 Days',
        metrics: {
            avgGlucose: 125,
            avgBP: '128/82',
            avgWeight: 74.2,
            avgSteps: 5400,
            medicationAdherence: 94
        },
        recommendations: [
            'Continue current exercise routine',
            'Reduce sodium intake by 20%',
            'Schedule quarterly check-up'
        ]
    };
}

function generateRiskReport() {
    return {
        type: 'Risk Assessment Report',
        riskFactors: {
            diabetes: { risk: 65, factors: ['Elevated glucose', 'BMI > 25', 'Age > 45'] },
            hypertension: { risk: 45, factors: ['Blood pressure trending up', 'Salt intake'] },
            heartDisease: { risk: 30, factors: ['Family history', 'Stress levels'] }
        },
        recommendations: [
            'Implement stricter glucose monitoring',
            'Increase cardio exercise to 150 min/week',
            'Consider medication review with doctor'
        ]
    };
}

function generateProgressReport() {
    return {
        type: 'Progress Report',
        period: 'Last 3 Months',
        improvements: [
            'Weight decreased by 2.3 kg',
            'Average glucose improved by 8 mg/dL',
            'Exercise consistency increased by 40%'
        ],
        goals: [
            'Maintain current weight loss trend',
            'Achieve target glucose levels',
            'Build strength training routine'
        ]
    };
}

function downloadReport(reportData, reportType) {
    const reportContent = JSON.stringify(reportData, null, 2);
    const blob = new Blob([reportContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthlens-${reportType}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Settings Functions
function confirmDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        showLoading();
        
        setTimeout(() => {
            // Clear all user data
            localStorage.clear();
            sessionStorage.clear();
            
            hideLoading();
            showSuccessMessage('Account deleted successfully. Redirecting to home page...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 1500);
    }
}

// UI Helper Functions
function showLoading() {
    // Create loading overlay if it doesn't exist
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p style="margin-top: 1rem; color: #4FC3F7;">Processing...</p>
            </div>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(overlay);
    } else {
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showWarningMessage(message) {
    showMessage(message, 'warning');
}

function showInfoMessage(message) {
    showMessage(message, 'info');
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.alert-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `alert alert-${type} alert-message`;
    messageEl.innerHTML = `
        <i class="fas fa-${getMessageIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Style the message
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(messageEl);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, 5000);
    
    // Add click to dismiss
    messageEl.addEventListener('click', () => {
        messageEl.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => messageEl.remove(), 300);
    });
}

function getMessageIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Add CSS animations for messages
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .alert-message {
        cursor: pointer;
        user-select: none;
    }
    
    .alert-message:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(79, 195, 247, 0.25);
    }
`;
document.head.appendChild(messageStyles);

// Export functions for global use
window.showPage = showPage;
window.switchTab = switchTab;
window.togglePassword = togglePassword;
window.signInWith = signInWith;
window.handleSignOut = handleSignOut;
window.calculateBMI = calculateBMI;
window.updateStressValue = updateStressValue;
window.nextTestimonial = nextTestimonial;
window.prevTestimonial = prevTestimonial;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleUserMenu = toggleUserMenu;
window.generateReport = generateReport;
window.confirmDeleteAccount = confirmDeleteAccount;