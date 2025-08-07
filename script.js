// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global variables
let currentProduct = {};
let quantity = 1;
let cartItems = [];

// Initialize page when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initializeWebsite();
});

function initializeWebsite() {
    initializeNavigation();
    initializeHeroSection();
    initializeProductSection();
    initializeOrderModal();
    initializeScrollAnimations();
    initializeImageErrorHandling();
    initializeContactForm();
}

// Navigation functionality
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('nav');
        if (window.scrollY > 100) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fixed Hero Section Initialization
function initializeHeroSection() {
    // Ensure hero content is visible immediately
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent && heroVisual) {
        // Reset any hidden states
        gsap.set([heroContent, heroVisual], {
            opacity: 1,
            y: 0,
            clearProps: "all"
        });

        // Hero animations with delay to ensure visibility
        setTimeout(() => {
            const heroTL = gsap.timeline();
            
            heroTL
                .from('.hero-badge', {
                    duration: 0.8,
                    opacity: 0,
                    y: 30,
                    ease: "back.out(1.7)"
                })
                .from('.hero-title', {
                    duration: 1.2,
                    opacity: 0,
                    y: 50,
                    ease: "power4.out"
                }, "-=0.4")
                .from('.hero-subtitle', {
                    duration: 1,
                    opacity: 0,
                    y: 30,
                    ease: "power3.out"
                }, "-=0.6")
                .from('.hero-buttons button', {
                    duration: 0.8,
                    opacity: 0,
                    y: 30,
                    stagger: 0.2,
                    ease: "back.out(1.7)"
                }, "-=0.4")
                .from('.hero-stats .stat-item', {
                    duration: 0.8,
                    opacity: 0,
                    y: 30,
                    stagger: 0.15,
                    ease: "power2.out"
                }, "-=0.2");

            // Counter animation
            animateCounters();
        }, 100);
    }
}

// Fixed Product Section
function initializeProductSection() {
    const productCards = document.querySelectorAll('.product-card');
    
    // Ensure products are visible initially
    productCards.forEach(card => {
        gsap.set(card, {
            opacity: 1,
            y: 0,
            clearProps: "transform"
        });
    });

    // Initialize product filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active', 'bg-white', 'text-primary');
                b.classList.add('bg-white/20', 'text-white', 'border-2', 'border-white/30');
            });
            
            btn.classList.add('active', 'bg-white', 'text-primary');
            btn.classList.remove('bg-white/20', 'text-white', 'border-2', 'border-white/30');
            
            // Filter products with animation
            filterProducts(btn.getAttribute('data-filter'));
        });
    });

    // Product scroll animation with intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.from(entry.target, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    productCards.forEach(card => {
        observer.observe(card);
        initializeProductCardHover(card);
    });
}

function filterProducts(filter) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const category = product.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            gsap.to(product, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "power2.out",
                display: 'block'
            });
        } else {
            gsap.to(product, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    product.style.display = 'none';
                }
            });
        }
    });
}

function initializeProductCardHover(card) {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -15,
            scale: 1.03,
            duration: 0.3,
            ease: "power2.out"
        });
        
        const img = card.querySelector('.product-image');
        if (img) {
            gsap.to(img, {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
        
        const img = card.querySelector('.product-image');
        if (img) {
            gsap.to(img, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
}

// Image error handling with enhanced fallback
function initializeImageErrorHandling() {
    document.querySelectorAll('.product-image, img').forEach(img => {
        img.onerror = function() {
            this.style.background = 'linear-gradient(135deg, #f8fafc, #e2e8f0)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<div class="text-gray-400 text-center"><i class="fas fa-image text-4xl mb-2"></i><div class="text-sm font-medium">Product Image</div></div>';
        };
        
        img.onload = function() {
            this.style.opacity = '1';
        };
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

// Fixed Order Modal Functions
function initializeOrderModal() {
    // Close modal when clicking outside
    const modal = document.getElementById('order-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeOrderModal();
            }
        });
    }

    // Form submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeOrderModal();
        }
    });
}

function openOrderModal(productName, price, originalPrice) {
    currentProduct = { productName, price, originalPrice };
    quantity = 1;
    
    // Update modal content
    const productNameEl = document.getElementById('modal-product-name');
    const priceEl = document.getElementById('modal-price');
    const originalPriceEl = document.getElementById('modal-original-price');
    const quantityEl = document.getElementById('quantity');
    const totalAmountEl = document.getElementById('total-amount');
    
    if (productNameEl) productNameEl.textContent = productName;
    if (priceEl) priceEl.textContent = `₹${price}`;
    if (originalPriceEl) originalPriceEl.textContent = originalPrice ? `₹${originalPrice}` : '';
    if (quantityEl) quantityEl.textContent = quantity;
    if (totalAmountEl) totalAmountEl.textContent = `₹${price}`;
    
    // Show modal with enhanced animation
    const modal = document.getElementById('order-modal');
    if (modal) {
        modal.classList.remove('hidden');
        
        gsap.fromTo(modal, 
            { opacity: 0 },
            { opacity: 1, duration: 0.4 }
        );
        
        gsap.fromTo(modal.querySelector('.modal-container'), 
            { opacity: 0, scale: 0.7, y: 100 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
        
        document.body.style.overflow = 'hidden';
    }
}

function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) {
        gsap.to(modal.querySelector('.modal-container'), {
            opacity: 0,
            scale: 0.7,
            y: 100,
            duration: 0.3,
            ease: "power2.in"
        });
        
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            delay: 0.1,
            onComplete: () => {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                
                // Reset form
                const form = document.getElementById('order-form');
                if (form) form.reset();
                
                // Reset submit button
                const submitText = document.getElementById('submit-text');
                const submitSpinner = document.getElementById('submit-spinner');
                const submitBtn = document.querySelector('#order-form button[type="submit"]');
                
                if (submitText) submitText.textContent = 'Place Order Now';
                if (submitSpinner) submitSpinner.classList.add('hidden');
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
}

function updateQuantity(change) {
    quantity = Math.max(1, quantity + change);
    const quantityEl = document.getElementById('quantity');
    const totalAmountEl = document.getElementById('total-amount');
    
    if (quantityEl) quantityEl.textContent = quantity;
    if (totalAmountEl) {
        const total = currentProduct.price * quantity;
        totalAmountEl.textContent = `₹${total}`;
    }
    
    // Animate quantity change
    if (quantityEl) {
        gsap.fromTo(quantityEl, 
            { scale: 1.2 },
            { scale: 1, duration: 0.2, ease: "back.out(1.7)" }
        );
    }
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');
    
    // Form validation
    const formData = new FormData(e.target);
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'state', 'pincode', 'paymentMethod'];
    
    for (let field of requiredFields) {
        if (!formData.get(field)) {
            showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
            return;
        }
    }
    
    if (submitBtn && submitText && submitSpinner) {
        // Show loading state
        submitText.textContent = 'Processing Order...';
        submitSpinner.classList.remove('hidden');
        submitBtn.disabled = true;
        
        // Simulate order processing
        setTimeout(() => {
            submitText.textContent = 'Order Confirmed!';
            submitSpinner.classList.add('hidden');
            
            // Show success animation
            gsap.to(submitBtn, {
                backgroundColor: '#10b981',
                duration: 0.3
            });
            
            setTimeout(() => {
                closeOrderModal();
                showNotification('🎉 Order placed successfully! We will contact you within 2 hours.', 'success');
                
                // Add to cart count for visual feedback
                const cartCount = document.getElementById('cart-count');
                if (cartCount) {
                    cartItems.push({
                        name: currentProduct.productName,
                        price: currentProduct.price,
                        quantity: quantity
                    });
                    cartCount.textContent = cartItems.length;
                }
                
                // Reset everything after delay
                setTimeout(() => {
                    if (submitText) submitText.textContent = 'Place Order Now';
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                    }
                }, 1000);
            }, 2000);
        }, 2000);
    }
}

// Enhanced Cart functionality
function addToCart(productName, price) {
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ name: productName, price: price, quantity: 1 });
    }
    
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cartItems.length;
        
        // Enhanced cart animation
        gsap.fromTo('#cart-btn', 
            { scale: 1 },
            { 
                scale: 1.3, 
                duration: 0.2, 
                yoyo: true, 
                repeat: 1, 
                ease: "power2.inOut",
                onComplete: () => {
                    gsap.to('#cart-btn', {
                        rotation: 360,
                        duration: 0.5,
                        ease: "power2.inOut"
                    });
                }
            }
        );
    }
    
    showNotification(`✨ ${productName} added to cart!`, 'success');
}

// Enhanced notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm ${
        type === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-red-500 to-rose-500'
    } text-white border border-white/20`;
    
    notification.innerHTML = `
        <div class="flex-shrink-0">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
            } text-2xl"></i>
        </div>
        <div class="flex-1">
            <div class="font-semibold">${message}</div>
        </div>
        <button onclick="this.parentElement.remove()" class="flex-shrink-0 ml-2 text-white/80 hover:text-white transition-colors">
            <i class="fas fa-times text-lg"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Enhanced animation
    gsap.fromTo(notification, 
        { opacity: 0, x: 100, scale: 0.8, rotation: 10 },
        { 
            opacity: 1, 
            x: 0, 
            scale: 1, 
            rotation: 0,
            duration: 0.5, 
            ease: "back.out(1.7)" 
        }
    );
    
    // Auto remove with countdown
    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            gsap.to(notification, {
                opacity: 0,
                x: 100,
                scale: 0.8,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => notification.remove()
            });
        }
    }, 1000);
}

// Advanced scroll animations
function initializeScrollAnimations() {
    // Trust indicators animation
    gsap.from('.trust-indicator', {
        scrollTrigger: {
            trigger: '.trust-indicator',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });

    // About section animations
    gsap.from('#about .grid > div', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power3.out"
    });

    // Contact section animation
    gsap.from('#contact .space-y-8 > div', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Contact form animation
    gsap.from('#contact .glass-effect', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });
}

// Counter animation with enhanced effects
function animateCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        
        gsap.fromTo(counter, {
            textContent: 0
        }, {
            textContent: target,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function() {
                counter.style.transform = `scale(${1 + Math.sin(this.progress() * Math.PI * 4) * 0.1})`;
            },
            onComplete: function() {
                counter.style.transform = 'scale(1)';
                gsap.to(counter, {
                    scale: 1.1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            }
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForms = document.querySelectorAll('#contact form');
    contactForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Form validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                    setTimeout(() => input.classList.remove('border-red-500'), 3000);
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Message Sent!';
                submitBtn.classList.add('bg-green-500');
                
                showNotification('📧 Message sent successfully! We\'ll get back to you soon.', 'success');
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('bg-green-500');
                    e.target.reset();
                }, 3000);
            }, 1500);
        });
    });
}

// Scroll to products function
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        const offsetTop = productsSection.offsetTop - 80;
        
        // Smooth scroll with enhanced animation
        gsap.to(window, {
            duration: 1.5,
            scrollTo: offsetTop,
            ease: "power3.inOut"
        });
        
        // Highlight products section briefly
        setTimeout(() => {
            gsap.fromTo('#products .text-center', 
                { scale: 1 },
                { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.inOut" }
            );
        }, 1600);
    }
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC to close any modals
    if (e.key === 'Escape') {
        const modal = document.getElementById('order-modal');
        if (modal && !modal.classList.contains('hidden')) {
            closeOrderModal();
        }
    }
    
    // Enter to trigger focused buttons
    if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        e.target.click();
    }
});

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger loading
                    img.classList.remove('opacity-0');
                    img.classList.add('opacity-100');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Performance optimization
function optimizePerformance() {
    // Throttle scroll events
    let ticking = false;
    
    function updateScrollPosition() {
        // Handle scroll-based animations here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
    optimizePerformance();
});

// Make functions globally available
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.updateQuantity = updateQuantity;
window.addToCart = addToCart;
window.scrollToProducts = scrollToProducts;

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openOrderModal,
        closeOrderModal,
        updateQuantity,
        addToCart,
        scrollToProducts
    };
}

// Console welcome message
console.log(`
🏥 GuruVed Healthcare Website Loaded Successfully!
✅ All features initialized
✅ Animations ready
✅ Order system active
✅ Mobile responsive
`);
