/*=================================================
FAQ
=================================================*/

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    if (!question) return;

    question.addEventListener("click", () => {

        faqItems.forEach(i => {

            if (i !== item) {
                i.classList.remove("active");
            }

        });

        item.classList.toggle("active");

    });

});


/*=================================================
LYVARYN COOKIE CONSENT
=================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const banner = document.getElementById("lyvarynCookieBanner");
    const modal = document.getElementById("lyvarynCookieModal");

    const acceptButton = document.getElementById("nxCookieAccept");
    const rejectButton = document.getElementById("nxCookieReject");
    const configureButton = document.getElementById("nxCookieConfigure");

    const closeButton = document.getElementById("nxCookieClose");
    const saveButton = document.getElementById("nxCookieSave");

    const preferencesInput =
        document.getElementById("nxCookiePreferences");

    const analyticsInput =
        document.getElementById("nxCookieAnalytics");

    const marketingInput =
        document.getElementById("nxCookieMarketing");


    const STORAGE_KEY = "lyvaryn_cookie_consent";


    /*
     * Mostrar banner
     */

    function showBanner() {

        if (!banner) return;

        banner.hidden = false;

    }


    /*
     * Ocultar banner
     */

    function hideBanner() {

        if (!banner) return;

        banner.hidden = true;

    }


    /*
     * Abrir panel
     */

    function openPreferences() {

        if (!modal) return;

        loadPreferences();

        modal.hidden = false;

        document.body.style.overflow = "hidden";

    }


    /*
     * Cerrar panel
     */

    function closePreferences() {

        if (!modal) return;

        modal.hidden = true;

        document.body.style.overflow = "";

    }


    /*
     * Obtener consentimiento guardado
     */

    function getConsent() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return null;
            }

            return JSON.parse(saved);

        } catch (error) {

            console.warn(
                "LYVARYN: no se pudo leer el consentimiento.",
                error
            );

            return null;

        }

    }


    /*
     * Guardar consentimiento
     */

    function saveConsent(preferences) {

        const consent = {

            necessary: true,

            preferences:
                Boolean(preferences.preferences),

            analytics:
                Boolean(preferences.analytics),

            marketing:
                Boolean(preferences.marketing),

            timestamp:
                new Date().toISOString(),

            version: "1.0"

        };


        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(consent)
            );

        } catch (error) {

            console.warn(
                "LYVARYN: no se pudo guardar el consentimiento.",
                error
            );

        }


        hideBanner();
        closePreferences();


        /*
         * Evento interno para futuras integraciones.
         */

        window.dispatchEvent(
            new CustomEvent(
                "lyvaryn:consent-updated",
                {
                    detail: consent
                }
            )
        );

    }


    /*
     * Cargar preferencias guardadas
     */

    function loadPreferences() {

        const consent = getConsent();


        if (!consent) {

            if (preferencesInput) {
                preferencesInput.checked = false;
            }

            if (analyticsInput) {
                analyticsInput.checked = false;
            }

            if (marketingInput) {
                marketingInput.checked = false;
            }

            return;

        }


        if (preferencesInput) {
            preferencesInput.checked =
                Boolean(consent.preferences);
        }

        if (analyticsInput) {
            analyticsInput.checked =
                Boolean(consent.analytics);
        }

        if (marketingInput) {
            marketingInput.checked =
                Boolean(consent.marketing);
        }

    }


    /*
     * Aceptar todas
     */

    if (acceptButton) {

        acceptButton.addEventListener(
            "click",
            () => {

                saveConsent({

                    preferences: true,
                    analytics: true,
                    marketing: true

                });

            }
        );

    }


    /*
     * Rechazar cookies no necesarias
     */

    if (rejectButton) {

        rejectButton.addEventListener(
            "click",
            () => {

                saveConsent({

                    preferences: false,
                    analytics: false,
                    marketing: false

                });

            }
        );

    }


    /*
     * Configurar
     */

    if (configureButton) {

        configureButton.addEventListener(
            "click",
            () => {

                openPreferences();

            }
        );

    }


    /*
     * Guardar preferencias
     */

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            () => {

                saveConsent({

                    preferences:
                        preferencesInput
                            ? preferencesInput.checked
                            : false,

                    analytics:
                        analyticsInput
                            ? analyticsInput.checked
                            : false,

                    marketing:
                        marketingInput
                            ? marketingInput.checked
                            : false

                });

            }
        );

    }


    /*
     * Cerrar panel
     */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                closePreferences();

            }
        );

    }


    /*
     * Cerrar haciendo clic en el fondo
     */

    if (modal) {

        const backdrop =
            modal.querySelector(
                ".nx-cookie-modal-backdrop"
            );

        if (backdrop) {

            backdrop.addEventListener(
                "click",
                () => {

                    closePreferences();

                }
            );

        }

    }


    /*
     * ESC para cerrar
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal &&
                !modal.hidden
            ) {

                closePreferences();

            }

        }
    );


    /*
     * Botón "Gestionar preferencias"
     * utilizado desde Política de Cookies.
     */

    window.addEventListener(
        "lyvaryn:manage-cookies",
        () => {

            openPreferences();

        }
    );


    /*
     * Inicialización
     */

    const existingConsent = getConsent();

    if (existingConsent) {

        hideBanner();

    } else {

        showBanner();

    }

});


/* =========================================================
   LYVARYN — SISTEMA GLOBAL DE TEMA
========================================================= */

(function () {

    const THEME_KEY = "lyvaryn-theme";

    /*
     * Aplicar el tema a HTML y BODY.
     * HTML permite preparar el tema antes de cargar la página.
     * BODY permite que los estilos actuales funcionen.
     */
    function applyTheme(theme) {

        const isLight = theme === "light";

        document.documentElement.classList.toggle(
            "light-theme",
            isLight
        );

        if (document.body) {

            document.body.classList.toggle(
                "light-theme",
                isLight
            );

        }

        updateThemeButton(isLight);
    }


    /*
     * Actualizar icono y accesibilidad del botón.
     */
    function updateThemeButton(isLight) {

        const themeToggles = [
            document.getElementById("themeToggle"),
            document.getElementById("mobileThemeToggle")
        ].filter(Boolean);

        if (!themeToggles.length) return;


        themeToggles.forEach(function (themeToggle) {

            const icon =
                themeToggle.querySelector("i");

            if (!icon) return;

            if (isLight) {

                icon.className =
                    "bi bi-sun-fill";

                themeToggle.setAttribute(
                    "aria-label",
                    "Cambiar a tema oscuro"
                );

                themeToggle.setAttribute(
                    "title",
                    "Cambiar a tema oscuro"
                );

            } else {

                icon.className =
                    "bi bi-moon-stars-fill";

            themeToggle.setAttribute(
                "aria-label",
                "Cambiar a tema claro"
            );

            themeToggle.setAttribute(
                "title",
                "Cambiar a tema claro"
            );
        }

    });

    }


    /*
     * Obtener el tema guardado.
     */
    function getSavedTheme() {

        try {

            return (
                localStorage.getItem(THEME_KEY)
                || "dark"
            );

        } catch (error) {

            console.warn(
                "LYVARYN: no se pudo leer el tema.",
                error
            );

            return "dark";
        }

    }


    /*
     * Guardar el tema.
     */
    function saveTheme(theme) {

        try {

            localStorage.setItem(
                THEME_KEY,
                theme
            );

        } catch (error) {

            console.warn(
                "LYVARYN: no se pudo guardar el tema.",
                error
            );

        }

    }


    /*
     * Inicializar cuando existe el BODY.
     */
    document.addEventListener(
        "DOMContentLoaded",
        function () {

            const savedTheme =
                getSavedTheme();

            applyTheme(savedTheme);


            const themeToggles = [
                document.getElementById("themeToggle"),
                document.getElementById("mobileThemeToggle")
            ].filter(Boolean);

            if (!themeToggles.length) return;


            themeToggles.forEach(function (themeToggle) {

                themeToggle.addEventListener(
                    "click",
                    function () {

                        const currentTheme =
                            getSavedTheme();

                        const newTheme =
                            currentTheme === "light"
                                ? "dark"
                                : "light";

                        saveTheme(newTheme);

                        applyTheme(newTheme);

                    }
                );

            });

        }
    );

})();