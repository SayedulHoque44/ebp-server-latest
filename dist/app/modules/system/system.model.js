"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlModel = exports.SystemInfoModel = void 0;
const mongoose_1 = require("mongoose");
const system_interface_1 = require("./system.interface");
const social_mediaSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
});
const postersSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: String, required: true },
});
const systemInfoSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        unique: true,
        enum: system_interface_1.SystemCategory,
    },
    logo_name: { type: String },
    logo_url: { type: String },
    primary_color: { type: String },
    secondary_color: { type: String },
    social_media: { type: [social_mediaSchema] },
    redirect_url: { type: [social_mediaSchema] },
    posters: { type: [postersSchema] },
});
const controlsSchema = new mongoose_1.Schema({
    systemId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "systemInfo" },
    title: { type: String, required: true },
    type: { type: String, required: true },
    Is_Control_Active: { type: Boolean, default: false },
    controlled_By_Time: { type: Boolean, default: false },
    start_time: { type: Date },
    end_time: { type: Date },
    action: { type: String, enum: system_interface_1.controlAction, default: "idle" },
});
exports.SystemInfoModel = (0, mongoose_1.model)("systemInfo", systemInfoSchema);
exports.ControlModel = (0, mongoose_1.model)("control", controlsSchema);
// Flow -
// 1. Create a new system
// 2. Create a new control for the system
// 3. Update the control
//  -in a system
// - firstly system get will be called using sytem id from the individual system
// - also using system id controls get will be called for using
// - then the system id also send to the every api call from the system
