(() => {
    const token = document.querySelector('meta[name="csrf-token"]')?.content;

    if (!token) return;

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("form").forEach((form) => {
            const method = (form.getAttribute("method") || "GET").toUpperCase();
            if (["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) return;
            if (form.querySelector('input[name="csrf_token"]')) return;

            const field = document.createElement("input");
            field.type = "hidden";
            field.name = "csrf_token";
            field.value = token;
            form.prepend(field);
        });
    });

    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, init = {}) => {
        const method = (init.method || (input instanceof Request && input.method) || "GET").toUpperCase();
        const url = new URL(input instanceof Request ? input.url : input, window.location.origin);

        if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method) && url.origin === window.location.origin) {
            const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
            headers.set("X-CSRFToken", token);
            init = { ...init, headers };
        }

        return nativeFetch(input, init);
    };
})();
