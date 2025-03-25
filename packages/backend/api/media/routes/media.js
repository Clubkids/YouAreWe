"use strict";
/**
 * Media router
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/api/upload',
            handler: 'media.upload',
            config: {
                policies: []
            }
        },
        {
            method: 'GET',
            path: '/api/media/:id',
            handler: 'media.findOne',
            config: {
                policies: []
            }
        }
    ]
};
