"use strict";
/**
 * Media controller for handling file uploads
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
exports.default = strapi_1.factories.createCoreController('api::media.media', ({ strapi }) => ({
    // Upload a media file
    async upload(ctx) {
        try {
            if (!ctx.request.files || !ctx.request.files.file) {
                return ctx.badRequest('No file provided');
            }
            // Cast to proper type - use 'as unknown' first to avoid TypeScript error
            const file = ctx.request.files.file;
            // Generate unique filename
            const ext = path_1.default.extname(file.name);
            const fileName = `${(0, uuid_1.v4)()}${ext}`;
            // Ensure uploads directory exists
            const uploadDir = path_1.default.join(process.cwd(), 'public/uploads/media');
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            }
            // Define file path
            const filePath = path_1.default.join(uploadDir, fileName);
            // Create a readable stream from the uploaded file
            const readStream = fs_1.default.createReadStream(file.path);
            const writeStream = fs_1.default.createWriteStream(filePath);
            // Copy the file
            await new Promise((resolve, reject) => {
                readStream.pipe(writeStream)
                    .on('finish', resolve)
                    .on('error', reject);
            });
            // Create media entry in database
            const media = await strapi.entityService.create('api::media.media', {
                data: {
                    filename: fileName,
                    mimetype: file.type,
                    path: `/uploads/media/${fileName}`,
                    size: file.size
                }
            });
            return { data: media };
        }
        catch (error) {
            ctx.internalServerError('Error uploading file');
            return { error: error.message };
        }
    },
    // Get a media file by ID
    async findOne(ctx) {
        try {
            const { id } = ctx.params;
            const media = await strapi.entityService.findOne('api::media.media', id);
            if (!media) {
                return ctx.notFound('Media not found');
            }
            return { data: media };
        }
        catch (error) {
            ctx.internalServerError('Error retrieving media');
            return { error: error.message };
        }
    }
}));
