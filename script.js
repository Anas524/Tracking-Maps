$(document).ready(function () {
    function toggleNavbarBg() {
        if ($(window).scrollTop() > 200 || $(".navbar-toggler").attr("aria-expanded") === "true") {
            $('.navbar').addClass('bg-light');
        } else {
            $('.navbar').removeClass('bg-light');
        }
    }

    // Detect scroll and toggle bg-light class
    $(window).on('scroll', function () {
        toggleNavbarBg();
    });

    // Detect navbar toggler click for mobile view
    $('.navbar-toggler').on('click', function () {
        setTimeout(toggleNavbarBg, 10); // Slight delay to allow toggler state to update
    });

    $('#home').on('click', function (e) {
        if ($(window).scrollTop() === 0) {
            location.reload(); // Reloads the page
        } else {
            e.preventDefault(); // Prevents default behavior if not at the top
            $('html, body').animate({ scrollTop: 0 }, 'slow'); // Smooth scroll to top
        }
    });

    // Initialize particles.js
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 80, // Adjust particle count
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff" // White particle color
            },
            "shape": {
                "type": "circle", // Shape of particles
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5, // Particle transparency
                "random": false,
                "anim": {
                    "enable": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150, // Distance for linking particles
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 6, // Adjust speed
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse" // Interaction mode (push particles away)
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                }
            },
            "modes": {
                "repulse": {
                    "distance": 100, // Repulse distance on hover
                    "duration": 0.4
                }
            }
        },
        "retina_detect": true
    });

    
    // Toggle service description visibility
    $('.service-title').on('click',function () {
        $(this).next('.service-description').slideToggle();
    });


    // Set the default language from localStorage or default to 'ar'
    let currentLang = localStorage.getItem('language') || 'ar';

    // Initialize the page with the correct language and direction
    changeLanguage(currentLang);

    // Toggle button click event
    $('#toggleLang').on('click', function () {
        if (currentLang === 'ar') {
            changeLanguage('en');
            $(this).text('عربي'); // Switch to Arabic
        } else {
            changeLanguage('ar');
            $(this).text('English'); // Switch to English
        }
    });

    function changeLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang); // Store language in localStorage

        // Change direction based on language
        if (lang === 'ar') {
            $('html').attr('dir', 'rtl'); // Set direction to RTL for Arabic
            $('#toggleLang').text('English'); // change button text to english
            $('#toggleLang').addClass('font-english') // Ensure the button has english font class
        } else {
            $('html').attr('dir', 'ltr'); // Set direction to LTR for English
            $('#toggleLang').text('عربي'); // Change button text to Arabic
            $('#toggleLang').removeClass('font-english'); // Optionally remove the english font class for Arabic
        }

        // Update language-specific text and fonts
        $('[data-lang-ar]').each(function () {
            const text = $(this).data(`lang-${lang}`);

            // Update placeholder for inputs or text for other elements
            if ($(this).is('input')) {
                $(this).attr('placeholder', text);
            } else {
                $(this).text(text);
            }

            // Switch font class based on language
            if (lang === 'ar') {
                $(this).removeClass('font-english').addClass('font-arabic');
            } else {
                $(this).removeClass('font-arabic').addClass('font-english');
            }
        });
    }

});
        
$(document).ready(function () {
    // Initialize the map centered at the main branch
    const map = L.map('map').setView([26.39783, 43.87193], 10);

    // Add tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Branch data with names in both Arabic and English
    const branches = [
        { name: { en: 'Qassim (Main Branch)', ar: 'القصيم (الفرع الرئيسي)' }, lat: 26.39783, lng: 43.87193 },
        { name: { en: 'Jeddah Branch', ar: 'فرع جدة' }, lat: 21.45974, lng: 39.25681 },
        { name: { en: 'Riyadh Branch', ar: 'فرع الرياض' }, lat: 24.65974, lng: 46.83165 }
    ];

    // Create markers for each branch and add them to the map
    const markers = branches.map(branch =>
        L.marker([branch.lat, branch.lng])
            .bindPopup(branch.name.en) // Default to English
            .addTo(map)
    );

    // Function to update marker popups with the correct language
    function updateMarkerPopups() {
        const lang = $('html').attr('lang'); // Detect the current language
        markers.forEach((marker, index) => {
            const branchName = branches[index].name[lang] || branches[index].name.en;
            marker.bindPopup(branchName);
        });
    }

    // Handle location link clicks to update the map view and tracking status
    $('#tracking-locations').on('click', '.location-link', function (e) {
        e.preventDefault(); // Prevent default link behavior

        const lat = $(this).data('lat');
        const lng = $(this).data('lng');
        const lang = $('html').attr('lang'); // Detect the current language

        const branch = branches.find(b => b.lat === lat && b.lng === lng);
        const branchName = branch.name[lang] || branch.name.en; // Use correct language

        const marker = markers.find(m => m.getLatLng().lat === lat && m.getLatLng().lng === lng);
        map.setView([lat, lng], 12);
        marker.bindPopup(branchName).openPopup();

    });

    // Initial setup: Open the main branch popup and set tracking status
    const mainBranchMarker = markers[0]; // The marker for the main branch
    mainBranchMarker.openPopup();

    // Bind popups to markers on load
    updateMarkerPopups();

    // Update marker popups when the language changes
    $(document).on('change', '#language-select', function () {
        updateMarkerPopups();
    });
});


$(document).ready(function() {
    $('#01').on('click', function(e) {
        e.preventDefault(); 
        $('html, body').scrollTop($('#sec-0').offset().top);
    });
    $('#aboutUs, #02').on('click', function(e) {
        e.preventDefault(); 
        $('html, body').scrollTop($('#sec-01').offset().top);
    });
    
    $('#services, #03, #05').on('click', function(e) {
        e.preventDefault(); 
        $('html, body').scrollTop($('#sec-02').offset().top);
    });
    
    $('#contactUs, #04, #06, #07').on('click', function(e) {
        e.preventDefault(); 
        $('html, body').scrollTop($('#sec-03').offset().top);
    });
    
    $('#mapViewBtn').on('click', function(e) {
        e.preventDefault(); 
        $('html, body').scrollTop($('#sec-04').offset().top);
    });
});

$(document).ready(function() {
    //common reveal options to create reveal animations
    ScrollReveal({ 
        reset: true,
        distance: '60px',
        duration: 2500,
        delay: 200 
    });
    
    //target elements, and specify options to create reveal animations
    ScrollReveal().reveal('.custom-section h1', { delay: 200, origin: 'left' });
    ScrollReveal().reveal('#sec-01 .image, .class-button, #map', { delay: 200, origin: 'bottom' });
    ScrollReveal().reveal('.text-about, .text-dec, .bottom-element-1 h4, .text-service', { delay: 200, origin: 'right' });
    ScrollReveal().reveal('#sec-02 .image, #sec-03 .image, .tracking-panel', { delay: 200, origin: 'top' });
    ScrollReveal().reveal('.social-icons i', { delay: 200, origin: 'bottom', interval: 200 });
    ScrollReveal().reveal('.media-info', { delay: 200, origin: 'left', interval: 100 });
});

//trengo ai tool
window.Trengo = window.Trengo || {};
window.Trengo.key = 'Iqs0u1wwdWFgC4pCgja0';
$(document).ready(function () {
    var script = $('<script>', {
        type: 'text/javascript',
        async: true,
        src: 'https://static.widget.trengo.eu/embed.js'
    });
    $('head').append(script);
});

$(document).ready(function() {
    function toggleSection(triggerId, sectionId) {
        $(triggerId).click(function() {
            // Hide all sections first
            $('#sec-05, #sec-06, #sec-07').not(sectionId).hide(); // Hide all except the clicked one
            
            // Show the selected section
            $(sectionId).toggle(); // Toggle visibility
            $(window).scrollTop($(sectionId).offset().top); // Scroll to the section
        });

        // Close button click handler
        $(sectionId).find('.close-btn').click(function() {
            $(sectionId).hide(); // Hide the section
        });
    }

    // Apply toggle for multiple sections
    toggleSection('#08', '#sec-05');
    toggleSection('#09', '#sec-06');
    toggleSection('#10', '#sec-07');
});