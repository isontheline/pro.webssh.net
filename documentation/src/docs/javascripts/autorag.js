function injectModule(url) {
    return import(url)
        .then(function (module) {
            return module;
        })
        .catch(function (error) {
            console.error('Failed to load module from ' + url + ':', error);
            throw error;
        });
}

function showDocumentationAssistant() {
    loadBulkResources([
        '/javascripts/winbox.bundle.min.js',
        'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css'
    ], function () {
        new WinBox({
            index: 1,
            id: 'documentation-assistant',
            title: 'WebSSH Documentation Assistant',
            modal: true,
            max: true,
            min: true,
            hidden: false,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            html: '<p>Please wait a second...</p>',
        });
        injectModule('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
            .then(function (module) {
                module.createChat({
                    mode: 'fullscreen',
                    target: 'div.wb-body',
                    webhookUrl: 'https://api.mengus.net/webhook/c468d733-6667-42b9-92c2-51ff1e396d88/chat',
                    initialMessages: [
                        "Hey 👋 Ask me anything about WebSSH and I will do my best to help you!",
                    ],
                    enableStreaming: true,
                    i18n: {
                        en: {
                            title: 'WebSSH Documentation Assistant',
                            subtitle: "",
                            footer: '',
                            getStarted: 'New Conversation',
                            inputPlaceholder: 'Type your question...',
                        },
                    },
                });
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    });
}