({
    baseUrl: '../../script',
    name: 'com/custardbelly/js/Request',
    include: ['com/custardbelly/js/RequestToken'],
    out: '../../deploy/script/custardbelly.common.min.js',
    optimize: "closure",
    uglify: {
        gen_codeOptions: {},
        strict_semicolons: {},
        do_toplevel: {},
        ast_squeezeOptions: {}
    }
})