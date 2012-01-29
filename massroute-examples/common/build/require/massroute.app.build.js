({
    baseUrl: '../../script',
    name: 'com/custardbelly/massroute/model/InflatableModel',
    include: ['com/custardbelly/massroute/model/Route', 'com/custardbelly/massroute/model/RouteStop'],
    out: '../../deploy/script/massroute.common.min.js',
    optimize: "closure",
    uglify: {
        gen_codeOptions: {},
        strict_semicolons: {},
        do_toplevel: {},
        ast_squeezeOptions: {}
    }
})