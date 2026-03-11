// JavaScript für das Kontaktformular mit E-Mail-Versand
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const captchaInput = document.getElementById('captcha-answer');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Verhindert das standardmäßige Absenden des Formulars
            
            // Aktuelle Sprache ermitteln
            const currentLang = document.documentElement.getAttribute('lang') || 'de';
            
            // Captcha-Überprüfung
            const captchaAnswer = parseInt(captchaInput.value);
            if (captchaAnswer !== 12) {
                alert(translations[currentLang]['js_captcha_error']);
                return;
            }
            
            // Formularfelder auslesen
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            
            // Einfache Validierung
            if (!name || !email || !message) {
                alert(translations[currentLang]['js_form_error']);
                return;
            }
            
            // Formular-Daten für FormSubmit vorbereiten
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);
            
            // Erfolgsbenachrichtigung anzeigen
            showSuccessMessage(name, currentLang);
            
            // Formular per AJAX an FormSubmit senden
            fetch('https://formsubmit.co/e45bd9cc58d2e76d5664bd5119ce0b5f', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log(translations[currentLang]['js_form_success']);
                // Keine weitere Aktion nötig, da die Erfolgsbenachrichtigung bereits angezeigt wird
            })
            .catch(error => {
                console.error(translations[currentLang]['js_form_error_msg'], error);
                // Bei Fehler trotzdem die Erfolgsbenachrichtigung anzeigen, da der Benutzer
                // alternative Kontaktmöglichkeiten hat
            });
        });
        
        function showSuccessMessage(name, lang) {
            // Erfolgsbenachrichtigung anzeigen
            const formContainer = document.querySelector('.contact-form-container');
            formContainer.innerHTML = `
                <div class="success-message">
                    <h3>${translations[lang]['js_thank_you']}</h3>
                    <p>${translations[lang]['js_dear']} ${name},</p>
                    <p>${translations[lang]['js_message_sent']}</p>
                    <p>${translations[lang]['js_no_response']}</p>
                    <p>${translations[lang]['js_regards']}<br>Astrid Kraft</p>
                </div>
            `;
            
            // Erfolgsbenachrichtigung stylen
            const successMessage = document.querySelector('.success-message');
            successMessage.style.backgroundColor = '#f8f9fa';
            successMessage.style.padding = '2rem';
            successMessage.style.borderRadius = '8px';
            successMessage.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            
            // Scroll zum Erfolgstext
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Wörter zählen für die Nachricht
        const messageTextarea = document.getElementById('contact-message');
        const wordCountInfo = document.querySelector('.word-count-info');
        const maxWords = parseInt(messageTextarea.getAttribute('data-max-words')) || 100;
        
        messageTextarea.addEventListener('input', function() {
            // Aktuelle Sprache ermitteln
            const currentLang = document.documentElement.getAttribute('lang') || 'de';
            
            const words = this.value.match(/\S+/g) || [];
            const wordCount = words.length;
            
            wordCountInfo.textContent = `${wordCount} ${translations[currentLang]['js_of_max']} ${maxWords} ${translations[currentLang]['js_words']}`;
            
            if (wordCount > maxWords) {
                wordCountInfo.style.color = 'red';
            } else {
                wordCountInfo.style.color = '#6c757d';
            }
        });
        
        // Event-Listener für Sprachänderungen
        document.addEventListener('languageChanged', function(e) {
            const lang = e.detail.language;
            const wordCountInfo = document.querySelector('.word-count-info');
            if (wordCountInfo) {
                const words = messageTextarea.value.match(/\S+/g) || [];
                const wordCount = words.length;
                wordCountInfo.textContent = `${wordCount} ${translations[lang]['js_of_max']} ${maxWords} ${translations[lang]['js_words']}`;
            }
        });
    }
});
