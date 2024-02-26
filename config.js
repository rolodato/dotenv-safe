(function () {
    var options = {};

    if (process.env.DOTENV_CONFIG_EXAMPLE != null) {
        options.example = process.env.DOTENV_CONFIG_EXAMPLE;
    }

    if (process.env.DOTENV_CONFIG_ALLOW_EMPTY_VALUES !== 'false') {
        options.allowEmptyValues = true;
    }

    process.argv.forEach(function (val) {
        var matches = val.match(/^dotenv_config_(.+)=(.+)/);
        if (matches) {
            options[matches[1]] = matches[2];
        }
    });
    require('.').config(options);
})();
