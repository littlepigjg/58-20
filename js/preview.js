const PreviewRenderer = (() => {

    let iframeEl = null;
    let containerEl = null;
    let currentView = 'desktop';

    function init(iframeSelector, containerSelector) {
        iframeEl = document.querySelector(iframeSelector);
        containerEl = document.querySelector(containerSelector);
    }

    function render(blocks) {
        if (!iframeEl) return;
        const html = TemplateEngine.renderFullHtml(blocks);
        const doc = iframeEl.contentDocument || iframeEl.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        if (TemplateEngine.hasLazyLoadImages(blocks)) {
            iframeEl.addEventListener('load', function onLoad() {
                iframeEl.removeEventListener('load', onLoad);
                try {
                    const win = iframeEl.contentWindow;
                    if (win && typeof win.execLazyLoadScript !== 'function') {
                        const scriptEl = doc.createElement('script');
                        scriptEl.type = 'text/javascript';
                        scriptEl.textContent = TemplateEngine.getLazyLoadScript();
                        doc.body.appendChild(scriptEl);
                    }
                } catch (e) {
                    console.warn('注入懒加载脚本失败:', e);
                }
            });
        }
    }

    function setView(view) {
        currentView = view;
        if (containerEl) {
            containerEl.classList.remove('view-desktop', 'view-mobile');
            containerEl.classList.add('view-' + view);
        }
    }

    function getView() {
        return currentView;
    }

    return {
        init,
        render,
        setView,
        getView
    };
})();
