
import { mat3, quat, vec2, vec3, vec4 } from 'gl-matrix';
import { Bone, ControlPoint, degToRad, Skeleton, Source1ModelInstance, SourceModel } from 'harmony-3d';
import { JSONObject } from 'harmony-types';
import SFM_DEFAULT_ANIMATION_GROUPS_URL from '../json/sfm_defaultanimationgroups.json';
import { DataModel } from './datamodel';
import { DmAttribute } from './dmattribute';
import { AT_BOOL, AT_COLOR, AT_ELEMENT, AT_ELEMENT_ARRAY, AT_FIRST_ARRAY_TYPE, AT_FLOAT, AT_FLOAT_ARRAY, AT_INT, AT_INT_ARRAY, AT_QANGLE, AT_QUATERNION, AT_STRING, AT_STRING_ARRAY, AT_TIME, AT_TIME_ARRAY, AT_VECTOR2, AT_VECTOR3, AT_VECTOR4, AT_VMATRIX, AT_VOID } from './dmattributetypes';
import { DmElement } from './dmelement';
import { DmSerializerKeyValues2 } from './dmserializerkeyvalues2';
import { BufferFlags, UtlBuffer } from './utlbuffer';

const CLIP_TYPE_CHANNEL = 0;
const CLIP_TYPE_AUDIO = 1;
const CLIP_TYPE_EFFECTS = 2;
const CLIP_TYPE_FILM = 3;

let createFilmClipId = 0;


const elementTemplates: Record<string, Record<string, any>> = {};

export function LookAt(sourcePoint: vec3, destPoint: vec3, upVector: vec3) {
	const z = vec3.sub(vec3.create(), destPoint, sourcePoint);
	vec3.normalize(z, z);
	const x = vec3.cross(vec3.create(), z, upVector);
	vec3.normalize(x, x);
	const y = vec3.cross(vec3.create(), z, x);
	vec3.normalize(y, y);

	const ret = quat.setAxes(quat.create(), x, z, y);
	quat.mul(ret, ret, [0.70710678118654752440084436210485, 0, 0, 0.70710678118654752440084436210485]);

	return ret;
}

/*
function OrthoNormalize(normal, tangent){
	normal.normalize();
	tangent.normalize();

	vec3.normalize(normal, forwardVector);
	vec3.normalize(forwardVector, forwardVector);

	return tangent.cross( normal );
}*/



export class SfmSession {
	#dmeSession = DataModel.createElement(undefined, 'DmElement');
	filmShot1?: DmElement;
	animSetEditorChannels?: DmElement;
	camerasDag?: DmElement;
	lightsDag?: DmElement;
	scene?: DmElement;
	overlayEffects?: DmElement;

	static defaultAnimationGroups?: JSONObject/*TODO: proper type*/;

	constructor(mapName = 'itemtest.bsp', clipName = 'SFM') {
		this.#populateSession(mapName, clipName);
	}

	#populateSession(mapName: string, clipName: string) {
		const dmeTimeSelection = this.#createDmeTimeSelection();
		const dmeSettings = DataModel.createElement(undefined, 'DmElement');
		dmeSettings.createAttribute('name', AT_STRING, 'sessionSettings');
		dmeSettings.createAttribute('timeSelection', AT_ELEMENT, dmeTimeSelection);

		const graphEditorState = DataModel.createElement(undefined, 'DmeGraphEditorState', 'graphEditorState');
		graphEditorState.createAttribute('displayGrid', AT_BOOL, true);

		//////////////////////////////////////////////////////////////////////////////////////////
		const proceduralPresets = DataModel.createElement(undefined, 'DmeProceduralPresetSettings', 'proceduralPresets');
		proceduralPresets.createAttribute('jitterscale', AT_FLOAT, 1);
		proceduralPresets.createAttribute('smoothscale', AT_FLOAT, 1);
		proceduralPresets.createAttribute('jitterscale_vector', AT_FLOAT, 2.5);
		proceduralPresets.createAttribute('smoothscale_vector', AT_FLOAT, 2.5);
		proceduralPresets.createAttribute('jitteriterations', AT_INT, 5);
		proceduralPresets.createAttribute('smoothiterations', AT_INT, 5);
		proceduralPresets.createAttribute('staggerinterval', AT_TIME, 0.0833);

		//////////////////////////////////////////////////////////////////////////////////////////
		const renderSettings = DataModel.createElement(undefined, 'DmElement', 'renderSettings');
		renderSettings.createAttribute('frameRate', AT_FLOAT, 24);
		renderSettings.createAttribute('lightAverage', AT_INT, 0);
		renderSettings.createAttribute('modelLod', AT_INT, 0);
		renderSettings.createAttribute('engineCameraEffects', AT_BOOL, 0);
		renderSettings.createAttribute('ambientOcclusionMode', AT_INT, 1);
		renderSettings.createAttribute('showAmbientOcclusion', AT_INT, 0);
		renderSettings.createAttribute('drawGameRenderablesMask', AT_INT, 216);
		renderSettings.createAttribute('drawToolRenderablesMask', AT_INT, 15);
		renderSettings.createAttribute('toneMapScale', AT_FLOAT, 1);
		const ProgressiveRefinement = DataModel.createElement(undefined, 'DmElement', 'ProgressiveRefinementSettings');
		ProgressiveRefinement.createAttribute('on', AT_BOOL, true);
		ProgressiveRefinement.createAttribute('useDepthOfField', AT_BOOL, true);
		ProgressiveRefinement.createAttribute('overrideDepthOfFieldQuality', AT_BOOL, false);
		ProgressiveRefinement.createAttribute('overrideDepthOfFieldQualityValue', AT_INT, 1);
		ProgressiveRefinement.createAttribute('useMotionBlur', AT_BOOL, true);
		ProgressiveRefinement.createAttribute('overrideMotionBlurQuality', AT_BOOL, false);
		ProgressiveRefinement.createAttribute('overrideMotionBlurQualityValue', AT_INT, 1);
		ProgressiveRefinement.createAttribute('useAntialiasing', AT_BOOL, true);
		ProgressiveRefinement.createAttribute('overrideShutterSpeed', AT_BOOL, false);
		ProgressiveRefinement.createAttribute('overrideShutterSpeedValue', AT_FLOAT, 0.020833334);
		renderSettings.createAttribute('ProgressiveRefinement', AT_ELEMENT, ProgressiveRefinement);

		//////////////////////////////////////////////////////////////////////////////////////////
		const posterSettings = DataModel.createElement(undefined, 'DmElement', 'posterSettings');
		posterSettings.createAttribute('width', AT_INT, 1920);
		posterSettings.createAttribute('height', AT_INT, 1080);
		posterSettings.createAttribute('DPI', AT_INT, 300);
		posterSettings.createAttribute('units', AT_INT, 0);
		posterSettings.createAttribute('constrainAspect', AT_BOOL, true);
		posterSettings.createAttribute('heightInPixels', AT_BOOL, true);
		posterSettings.createAttribute('widthInPixels', AT_BOOL, true);
		posterSettings.createAttribute('format', AT_STRING, 'PNG');

		//////////////////////////////////////////////////////////////////////////////////////////
		const movieSettings = DataModel.createElement(undefined, 'DmElement', 'movieSettings');
		movieSettings.createAttribute('videoTarget', AT_INT, 6);
		movieSettings.createAttribute('audioTarget', AT_INT, 2);
		movieSettings.createAttribute('stereoscopic', AT_BOOL, 0);
		movieSettings.createAttribute('stereoSingleFile', AT_BOOL, 0);
		movieSettings.createAttribute('clearDecals', AT_BOOL, 0);
		movieSettings.createAttribute('width', AT_INT, 1280);
		movieSettings.createAttribute('height', AT_INT, 720);
		movieSettings.createAttribute('filename', AT_STRING, null);

		//////////////////////////////////////////////////////////////////////////////////////////
		const sharedPresetGroupSettings = DataModel.createElement(undefined, 'DmElement', 'sharedPresetGroupSettings');
		sharedPresetGroupSettings.createAttribute('presetGroupInfos', AT_ELEMENT_ARRAY, null);


		dmeSettings.createAttribute('graphEditorState', AT_ELEMENT, graphEditorState);
		dmeSettings.createAttribute('proceduralPresets', AT_ELEMENT, proceduralPresets);
		dmeSettings.createAttribute('renderSettings', AT_ELEMENT, renderSettings);
		dmeSettings.createAttribute('posterSettings', AT_ELEMENT, posterSettings);
		dmeSettings.createAttribute('movieSettings', AT_ELEMENT, movieSettings);
		dmeSettings.createAttribute('sharedPresetGroupSettings', AT_ELEMENT, sharedPresetGroupSettings);

		this.animSetEditorChannels = this.createDmeTrack('animSetEditorChannels', [], CLIP_TYPE_CHANNEL);

		//var camera = this.createDmeCamera('camera1');
		//this.mainCamera = camera;
		const cameras = this.createDmeDag('Cameras', this.#createDmeTransform(), [/*camera*/]);
		this.camerasDag = cameras;
		this.scene = this.createDmeDag('scene', this.#createDmeTransform(), [cameras]);
		const soundDialog = this.createDmeTrack('Dialog', [], CLIP_TYPE_AUDIO);
		const soundMusic = this.createDmeTrack('Music', [], CLIP_TYPE_AUDIO);
		const soundEffects = this.createDmeTrack('Effects', [], CLIP_TYPE_AUDIO);
		this.overlayEffects = this.createDmeTrack('Effects', [], CLIP_TYPE_FILM);
		this.filmShot1 = this.#createFilmClip('shot1',
			[this.#createDmeTrackGroup('channelTrackGroup',
				[this.animSetEditorChannels])], undefined, undefined, this.scene,
			[/*animSet*/], ''
		);

		//this.mainCameraAnimSet = this.createAnimSetForCamera('camera1', camera);
		const subClipTrackGroupFilm = this.createDmeTrack('Film', [this.filmShot1], CLIP_TYPE_FILM);

		const activeClip = this.#createFilmClip(clipName,
			[
				this.#createDmeTrackGroup('Sound', [soundDialog, soundMusic, soundEffects]),
				this.#createDmeTrackGroup('Overlay', [this.overlayEffects]),
			],
			this.#createDmeTrackGroup('subClipTrackGroup', [subClipTrackGroupFilm]), undefined, undefined, undefined, mapName
		);

		this.#dmeSession.createAttribute('activeClip', AT_ELEMENT, activeClip);
		this.#dmeSession.createAttribute('miscBin', AT_ELEMENT_ARRAY, null);
		this.#dmeSession.createAttribute('cameraBin', AT_ELEMENT_ARRAY, null);
		this.#dmeSession.createAttribute('clipBin', AT_ELEMENT_ARRAY, [activeClip]);
		this.#dmeSession.createAttribute('name', AT_STRING, 'session');
		this.#dmeSession.createAttribute('settings', AT_ELEMENT, dmeSettings);
		/*dmeSession.createAttribute('graphEditorState', AT_ELEMENT, graphEditorState);
		dmeSession.createAttribute('proceduralPresets', AT_ELEMENT, proceduralPresets);
		dmeSession.createAttribute('renderSettings', AT_ELEMENT, renderSettings);
		dmeSession.createAttribute('posterSettings', AT_ELEMENT, posterSettings);
		dmeSession.createAttribute('movieSettings', AT_ELEMENT, movieSettings);
		dmeSession.createAttribute('sharedPresetGroupSettings', AT_ELEMENT, sharedPresetGroupSettings);*/
	}

	#createFilmClip(clipName: string, trackGroups: DmElement[] = [], subClipTrackGroup: DmElement | undefined, camera: never | undefined, scene: DmElement | undefined, animationSets: never[] | undefined = [], mapname: string) {
		//animationSets = (animationSets instanceof Array) ? animationSets : [];
		++createFilmClipId;
		const dmeFilmClip = DataModel.createElement(undefined, 'DmeFilmClip', clipName/*'test' + CreateFilmClip.clipId*/);
		dmeFilmClip.createAttribute('timeFrame', AT_ELEMENT, this.#createDmeTimeFrame());
		dmeFilmClip.createAttribute('color', AT_COLOR, vec4.fromValues(0, 0, 0, 0)/*'0 255 0 255'*/);
		dmeFilmClip.createAttribute('text', AT_STRING, '');
		dmeFilmClip.createAttribute('mute', AT_BOOL, false);

		// Tracks
		//trackGroups = (trackGroups instanceof Array) ? trackGroups : [];
		//subClipTrackGroup = (subClipTrackGroup instanceof Array) ? subClipTrackGroup : [];
		dmeFilmClip.createAttribute('trackGroups', AT_ELEMENT_ARRAY, trackGroups);
		dmeFilmClip.createAttribute('displayScale', AT_FLOAT, 1);
		dmeFilmClip.createAttribute('materialOverlay', AT_ELEMENT, null);
		dmeFilmClip.createAttribute('mapname', AT_STRING, mapname);
		dmeFilmClip.createAttribute('camera', AT_ELEMENT, camera);
		dmeFilmClip.createAttribute('monitorCameras', AT_ELEMENT_ARRAY, []);
		dmeFilmClip.createAttribute('activeMonitor', AT_INT, -1);
		dmeFilmClip.createAttribute('scene', AT_ELEMENT, scene);
		dmeFilmClip.createAttribute('aviFile', AT_STRING, null);
		dmeFilmClip.createAttribute('fadeIn', AT_TIME, 0);
		dmeFilmClip.createAttribute('fadeOut', AT_TIME, 0);
		dmeFilmClip.createAttribute('inputs', AT_ELEMENT_ARRAY, null);
		dmeFilmClip.createAttribute('operators', AT_ELEMENT_ARRAY, null);
		dmeFilmClip.createAttribute('useAviFile', AT_BOOL, false);
		dmeFilmClip.createAttribute('animationSets', AT_ELEMENT_ARRAY, animationSets);
		dmeFilmClip.createAttribute('bookmarkSets', AT_ELEMENT_ARRAY, null);
		dmeFilmClip.createAttribute('activeBookmarkSet', AT_INT, 0);
		dmeFilmClip.createAttribute('subClipTrackGroup', AT_ELEMENT, subClipTrackGroup);
		dmeFilmClip.createAttribute('volume', AT_FLOAT, 1);
		dmeFilmClip.createAttribute('concommands', AT_STRING_ARRAY, null);
		dmeFilmClip.createAttribute('convars', AT_STRING_ARRAY, null);

		return dmeFilmClip;
	}

	out() {
		const buf = new UtlBuffer(BufferFlags.TEXT_BUFFER);
		new DmSerializerKeyValues2(false).serialize(buf, this.#dmeSession);
		return buf.getBuffer();
	}

	#createDmeTimeSelection(name?: string) {
		const dmeTimeSelection = DataModel.createElement(undefined, 'DmeTimeSelection', name);
		dmeTimeSelection.createAttribute('name', AT_STRING, 'timeSelection');
		dmeTimeSelection.createAttribute('enabled', AT_BOOL, true);
		dmeTimeSelection.createAttribute('relative', AT_BOOL, false);
		dmeTimeSelection.createAttribute('falloff_left', AT_TIME, -214748.3647);
		dmeTimeSelection.createAttribute('falloff_right', AT_TIME, 214748.3647);
		dmeTimeSelection.createAttribute('hold_left', AT_TIME, -214748.3647);
		dmeTimeSelection.createAttribute('hold_right', AT_TIME, 214748.3647);
		dmeTimeSelection.createAttribute('interpolator_left', AT_INT, 6);
		dmeTimeSelection.createAttribute('interpolator_right', AT_INT, 6);
		dmeTimeSelection.createAttribute('threshold', AT_FLOAT, 0.0005);
		dmeTimeSelection.createAttribute('resampleinterval', AT_TIME, 0.0100);
		dmeTimeSelection.createAttribute('recordingstate', AT_INT, 2);
		return dmeTimeSelection;
	}

	createDmeTrack(trackName: string, children: DmElement[] = [], clipType = 0) {
		const dmeTrack = DataModel.createElement(undefined, 'DmeTrack', trackName);
		//TODO
		/*	var childList = [];
			if (children instanceof Array) {
				for (var i = 0; i < children.length; ++i) {
					var child = children[i];
					childList.push(child);
				}
			}	*/
		//children = (children instanceof Array) ? children : [];
		//clipType = (clipType === undefined) ? 0 : clipType;

		dmeTrack.createAttribute('children', AT_ELEMENT_ARRAY, children);

		dmeTrack.createAttribute('collapsed', AT_BOOL, false);
		dmeTrack.createAttribute('mute', AT_BOOL, false);
		dmeTrack.createAttribute('synched', AT_BOOL, true);
		dmeTrack.createAttribute('clipType', AT_INT, clipType);
		dmeTrack.createAttribute('volume', AT_FLOAT, 1);
		dmeTrack.createAttribute('displayScale', AT_FLOAT, 1);

		return dmeTrack;
	}

	createDmeCamera(cameraName: string, cameraPos: vec3, cameraLookAt: vec3, rollAngle: number) {
		rollAngle = rollAngle || 0;

		const cameraOrientation = LookAt(cameraPos, cameraLookAt, [0, 0, 1]);

		// Add a roll effect
		if (rollAngle && !isNaN(rollAngle)) {
			const rollQuat = quat.setAxisAngle(quat.create(), [1, 0, 0], degToRad(rollAngle));
			quat.mul(cameraOrientation, cameraOrientation, rollQuat);
		}

		const cameraTransform = this.#createDmeTransform(undefined, cameraPos, cameraOrientation);
		const dmeCamera = DataModel.createElement(undefined, 'DmeCamera', cameraName);
		dmeCamera.createAttribute('transform', AT_ELEMENT, cameraTransform);

		//TODO
		return dmeCamera;
	}

	createDmeGlobalFlexControllerOperator(name: string, flexWeight: number, gameModel: DmElement) {
		const dmeGlobalFlexControllerOperator = DataModel.createElement(undefined, 'DmeGlobalFlexControllerOperator', name);
		dmeGlobalFlexControllerOperator.createAttribute('flexWeight', AT_FLOAT, flexWeight);
		dmeGlobalFlexControllerOperator.createAttribute('gameModel', AT_ELEMENT, gameModel);
		return dmeGlobalFlexControllerOperator;
	}

	createDmeDag(name: string, transform: DmElement, children: DmElement[] = []) {
		const dmeDag = DataModel.createElement(undefined, 'DmeDag', name);

		dmeDag.createAttribute('transform', AT_ELEMENT, transform);
		dmeDag.createAttribute('shape', AT_ELEMENT, null);
		dmeDag.createAttribute('visible', AT_BOOL, true);

		//children = (children instanceof Array) ? children : [];
		dmeDag.createAttribute('children', AT_ELEMENT_ARRAY, children);

		/*'id' 'elementid' 'd992aa4f-2c4f-4324-9e00-e14727212fe9'
		'name' 'string' 'Cameras'
		'transform' 'DmeTransform'
		{
			'id' 'elementid' '8f7bce97-1f26-40c3-8345-2ad85228d716'
			'name' 'string' 'unnamed'
			'position' 'vector3' '0 0 0'
			'orientation' 'quaternion' '0 0 0 1'
		}

		'shape' 'element' ''
		'visible' 'bool' '1'
		'children' 'element_array'
		[
			'element' '728206b7-a13d-4242-b09c-572bae8c05d3'
		]*/


		//TODO
		return dmeDag;
	}

	#createDmeTransform(name?: string, position = vec3.create(), orientation = quat.create(), scale?: number) {

		const dmeTransform = DataModel.createElement(undefined, 'DmeTransform', name);

		dmeTransform.createAttribute('position', AT_VECTOR3, position);//TODO
		dmeTransform.createAttribute('orientation', AT_QUATERNION, orientation);//TODO
		if (scale !== undefined) {
			dmeTransform.createAttribute('scale', AT_FLOAT, scale);//TODO
		}

		/*'position' 'vector3' '0 0 0'
		'orientation' 'quaternion' '0 0 0 1'*/
		//TODO
		return dmeTransform;
	}

	#createDmeChannel(name: string, fromElement: DmElement, fromAttribute: string, fromIndex: number, toElement: DmElement, toAttribute: string, toIndex: number, mode: number) {
		const dmeChannel = DataModel.createElement(undefined, 'DmeChannel', name);

		dmeChannel.createAttribute('fromElement', AT_ELEMENT, fromElement);
		dmeChannel.createAttribute('fromAttribute', AT_STRING, fromAttribute);
		dmeChannel.createAttribute('fromIndex', AT_INT, fromIndex);

		dmeChannel.createAttribute('toElement', AT_ELEMENT, toElement);
		dmeChannel.createAttribute('toAttribute', AT_STRING, toAttribute);
		dmeChannel.createAttribute('toIndex', AT_INT, toIndex);

		dmeChannel.createAttribute('mode', AT_INT, mode);

		dmeChannel.createAttribute('log', AT_ELEMENT, null);

		return dmeChannel;
	}

	#getTypeName(type: number/*TODO: improve type*/) {
		switch (type) {
			/*

			var AT_STRING = 5;
			var AT_VOID = 6;
			var AT_OBJECTID = 7;
			var AT_TIME = 7;
			var AT_COLOR = 8; //rgba
			var AT_VECTOR2 = 9;
			var AT_VECTOR3 = 10;
			var AT_VECTOR4 = 11;
			var AT_QANGLE = 12;
			var AT_QUATERNION = 13;
			var AT_VMATRIX = 14;
			*/
			case AT_INT:
				return 'Int';
			case AT_FLOAT:
				return 'Float';
			case AT_BOOL:
				return 'Bool';
			case AT_STRING:
				return 'String';
			case AT_TIME:
				return 'Time';
			case AT_COLOR:
				return 'Color';
			case AT_VECTOR2:
				return 'Vector2';
			case AT_VECTOR3:
				return 'Vector3';
			case AT_VECTOR4:
				return 'Vector4';
			case AT_QANGLE:
				return 'QAngle';
			case AT_QUATERNION:
				return 'Quaternion';
			case AT_VMATRIX:
				return 'VMatrix';
		}
		console.error('Unknown type in getTypeName ' + type);
		return '';
	}

	#createDmeTypedLog(type: number/*TODO: improve type*/, name: string, times: number[] = [], values: any[] = []) {
		//times = (times instanceof Array) ? times : [];
		//values = (values instanceof Array) ? values : [];

		const elementTypeName = 'Dme' + this.#getTypeName(type) + 'Log';
		const dmeTypedLog = DataModel.createElement(undefined, elementTypeName, name);

		const dmeTypedLayer = this.#createDmeTypedLayer(type, name, times, values);

		dmeTypedLog.createAttribute('layers', AT_ELEMENT_ARRAY, [dmeTypedLayer]);

		dmeTypedLog.createAttribute('curveinfo', AT_ELEMENT, null);
		dmeTypedLog.createAttribute('usedefaultvalue', AT_BOOL, false);
		dmeTypedLog.createAttribute('defaultvalue', type, null);
		if ((type == AT_VECTOR3) || (type == AT_QUATERNION)) {
			dmeTypedLog.createAttribute('bookmarksX', AT_TIME_ARRAY, []);
			dmeTypedLog.createAttribute('bookmarksY', AT_TIME_ARRAY, []);
			dmeTypedLog.createAttribute('bookmarksZ', AT_TIME_ARRAY, []);
		}
		dmeTypedLog.createAttribute('bookmarks', AT_TIME_ARRAY, []);
		return dmeTypedLog;
	}

	#createDmeTypedLayer(type: number/*TODO: improve type*/, name: string, times: number[], values: any[]) {
		times = (times instanceof Array) ? times : [];
		values = (values instanceof Array) ? values : [];

		const elementTypeName = 'Dme' + this.#getTypeName(type) + 'LogLayer';
		const dmeTypedLayer = DataModel.createElement(undefined, elementTypeName, name);

		dmeTypedLayer.createAttribute('times', AT_TIME_ARRAY, times);
		dmeTypedLayer.createAttribute('curvetypes', AT_INT_ARRAY, []);
		dmeTypedLayer.createAttribute('values', type + AT_FIRST_ARRAY_TYPE - 1, values);
		dmeTypedLayer.createAttribute('compressed', AT_VOID, null);

		return dmeTypedLayer;
	}

	#createDmeChannelsClip(name: string, timeFrame: DmElement, channels: DmElement[]) {
		const dmeChannelsClip = DataModel.createElement(undefined, 'DmeChannelsClip', name);

		dmeChannelsClip.createAttribute('timeFrame', AT_ELEMENT, timeFrame);
		dmeChannelsClip.createAttribute('color', AT_COLOR, vec4.fromValues(0, 0, 0, 0)/*'0 0 0 1'*/);//TODO
		dmeChannelsClip.createAttribute('text', AT_STRING, '');//TODO
		dmeChannelsClip.createAttribute('mute', AT_BOOL, false);//TODO
		dmeChannelsClip.createAttribute('trackGroups', AT_ELEMENT_ARRAY, []);//TODO
		dmeChannelsClip.createAttribute('displayScale', AT_FLOAT, 1);//TODO

		//channels = (channels instanceof Array) ? channels : [];
		dmeChannelsClip.createAttribute('channels', AT_ELEMENT_ARRAY, channels);
		/*
													'DmeChannelsClip'
													{
														'id' 'elementid' '278a8431-1d77-4ba9-8747-65abe1dbf8b0'
														'name' 'string' 'c_flamethrower_decorated1'
														'timeFrame' 'DmeTimeFrame'
														{
															'id' 'elementid' '020f0ebc-99a4-424b-b2e1-dece05a01852'
															'name' 'string' 'unnamed'
															'start' 'time' '-5.0000'
															'duration' 'time' '70.0000'
															'offset' 'time' '0.0000'
															'scale' 'float' '1'
														}

														'color' 'color' '0 0 0 0'
														'text' 'string' ''
														'mute' 'bool' '0'
														'trackGroups' 'element_array'
														[
														]
														'displayScale' 'float' '1'
														'channels' 'element_array'
														[
															'element' '7d1da3e1-7094-494c-a231-902b36c2a850',
															'element' 'b8bff802-607a-46dc-9995-9c151e068f06',
															'element' 'c8061567-9a9f-4789-bbdd-e4a1ae87c364',
															'element' '3ef02c3b-270e-4578-a975-1f95ee205711',
															'element' 'af611c17-a195-488a-a102-5ad5bb2e3519',
															'element' '6f4ddae6-596a-4fd2-a986-aefd72ce7fbf',
															'element' '93cb8ba6-582f-4414-8fcf-079cf3eea6ae',
															'element' 'df1c8986-b0de-47ac-859f-2427605faeb1',
															'element' 'ae0de9dd-aacf-4499-9fe3-79c80d08ce27',
															'element' 'bf385735-4682-4544-946e-8f1220554fcb'
														]
													}
		*/
		//TODO
		return dmeChannelsClip;
	}

	#createDmeTrackGroup(trackGroupName: string, tracks: DmElement[]) {
		const dmeTrackGroup = DataModel.createElement(undefined, 'DmeTrackGroup', trackGroupName);

		const trackList = Array.from(tracks);

		// Tracks
		dmeTrackGroup.createAttribute('tracks', AT_ELEMENT_ARRAY, trackList);
		dmeTrackGroup.createAttribute('visible', AT_BOOL, true);
		dmeTrackGroup.createAttribute('mute', AT_BOOL, false);
		dmeTrackGroup.createAttribute('displayScale', AT_FLOAT, 1);
		dmeTrackGroup.createAttribute('minimized', AT_BOOL, false);
		dmeTrackGroup.createAttribute('volume', AT_FLOAT, 1);
		dmeTrackGroup.createAttribute('forcemultitrack', AT_BOOL, false);

		return dmeTrackGroup;
	}

	#createDmeTimeFrame(name?: string, startTime = 0, duration = 60, offset = 0, scale = 1) {
		const dmeTimeFrame = DataModel.createElement(undefined, 'DmeTimeFrame');
		dmeTimeFrame.createAttribute('start', AT_TIME, startTime);
		dmeTimeFrame.createAttribute('duration', AT_TIME, duration);
		dmeTimeFrame.createAttribute('offset', AT_TIME, offset);
		dmeTimeFrame.createAttribute('scale', AT_FLOAT, scale);

		/*
				'name' 'string' 'unnamed'
			'start' 'time' '0.0000'
			'duration' 'time' '60.0000'
			'offset' 'time' '0.0000'
			'scale' 'float' '1'*/

		return dmeTimeFrame;
	}

	#createDmeTransformControl(name: string, valuePosition = vec3.create(), valueOrientation = quat.create(), positionChannel?: DmElement, orientationChannel?: DmElement) {
		const dmeTransformControl = DataModel.createElement(undefined, 'DmeTransformControl', name);

		dmeTransformControl.createAttribute('valuePosition', AT_VECTOR3, valuePosition);//TODO
		dmeTransformControl.createAttribute('valueOrientation', AT_QUATERNION, valueOrientation);//TODO
		dmeTransformControl.createAttribute('positionChannel', AT_ELEMENT, positionChannel);//TODO
		dmeTransformControl.createAttribute('orientationChannel', AT_ELEMENT, orientationChannel);//TODO

		/*
		'valuePosition' 'vector3' '0 0 0'
		'valueOrientation' 'quaternion' '0.4999978542 0.4999978542 0.4999978542 0.5000064373'
		'positionChannel' 'element' '7d1da3e1-7094-494c-a231-902b36c2a850'
		'orientationChannel' 'element' 'b8bff802-607a-46dc-9995-9c151e068f06'
		*/

		return dmeTransformControl;
	}

	#createDmeScaleControl(name: string, valueScale: number, scaleChannel: DmElement) {
		const dmeTransformControl = DataModel.createElement(undefined, 'DmElement', name);

		dmeTransformControl.createAttribute('value', AT_FLOAT, valueScale);//TODO
		dmeTransformControl.createAttribute('channel', AT_ELEMENT, scaleChannel);//TODO
		dmeTransformControl.createAttribute('defaultValue', AT_FLOAT, 0.1);//TODO

		return dmeTransformControl;
	}

	#createDmeAnimationSet(name: string, controls: DmElement[], rootControlGroup: DmElement/*, gameModel*/) {
		const dmeAnimationSet = DataModel.createElement(undefined, 'DmeAnimationSet', name);

		//controls = (controls instanceof Array) ? controls : [];
		dmeAnimationSet.createAttribute('controls', AT_ELEMENT_ARRAY, controls);
		dmeAnimationSet.createAttribute('presetGroups', AT_ELEMENT_ARRAY, null);
		dmeAnimationSet.createAttribute('phonememap', AT_ELEMENT_ARRAY, null);
		dmeAnimationSet.createAttribute('operators', AT_ELEMENT_ARRAY, null);
		dmeAnimationSet.createAttribute('rootControlGroup', AT_ELEMENT, rootControlGroup);
		//dmeAnimationSet.createAttribute('gameModel', AT_ELEMENT, gameModel);

		return dmeAnimationSet;
	}

	#createDmeGameModel(name: string, modelName: string, transform: DmElement | undefined, children: DmElement[] = [], skin = 0, bodyGroups: number, bones: DmElement[] = []) {
		//skin = typeof skin == 'number' ? skin : 0;
		//children = (children instanceof Array) ? children : [];
		//bones = (bones instanceof Array) ? bones : [];

		const dmeGameModel = DataModel.createElement(undefined, 'DmeGameModel', name);
		dmeGameModel.createAttribute('transform', AT_ELEMENT, transform);
		dmeGameModel.createAttribute('shape', AT_ELEMENT, null);
		dmeGameModel.createAttribute('visible', AT_BOOL, true);

		dmeGameModel.createAttribute('children', AT_ELEMENT_ARRAY, children);
		dmeGameModel.createAttribute('flexWeights', AT_FLOAT_ARRAY, null);
		dmeGameModel.createAttribute('modelName', AT_STRING, modelName);
		dmeGameModel.createAttribute('skin', AT_INT, skin);
		dmeGameModel.createAttribute('body', AT_INT, bodyGroups);
		dmeGameModel.createAttribute('sequence', AT_INT, 0);
		dmeGameModel.createAttribute('flags', AT_INT, 0);
		dmeGameModel.createAttribute('bones', AT_ELEMENT_ARRAY, bones);
		dmeGameModel.createAttribute('globalFlexControllers', AT_ELEMENT_ARRAY, null);
		dmeGameModel.createAttribute('computeBounds', AT_BOOL, true);
		dmeGameModel.createAttribute('evaluateProceduralBones', AT_BOOL, true);
		dmeGameModel.createAttribute('flexnames', AT_STRING_ARRAY, null);
		dmeGameModel.createAttribute('illumPositionDag', AT_ELEMENT, null);
		dmeGameModel.createAttribute('localViewTargetFactor', AT_FLOAT, null);
		dmeGameModel.createAttribute('eyes_convergence', AT_FLOAT, null);

		return dmeGameModel;
	}

	createDmeGameParticleSystem(name: string, systemName: string, transform: DmElement) {
		const dmeGameParticleSystem = DataModel.createElement(undefined, 'DmeGameParticleSystem', name);
		dmeGameParticleSystem.createAttribute('transform', AT_ELEMENT, transform);
		dmeGameParticleSystem.createAttribute('shape', AT_ELEMENT, null);
		dmeGameParticleSystem.createAttribute('visible', AT_BOOL, true);

		dmeGameParticleSystem.createAttribute('children', AT_ELEMENT_ARRAY, []);
		dmeGameParticleSystem.createAttribute('particleSystemType', AT_STRING, systemName);
		dmeGameParticleSystem.createAttribute('particleSystemDefinition', AT_ELEMENT, null);
		dmeGameParticleSystem.createAttribute('simulating', AT_BOOL, true);
		dmeGameParticleSystem.createAttribute('emitting', AT_BOOL, true);
		dmeGameParticleSystem.createAttribute('randomSeed', AT_INT, 1);
		dmeGameParticleSystem.createAttribute('simulationTimeScale', AT_FLOAT, 1);


		dmeGameParticleSystem.createAttribute('controlPoints', AT_ELEMENT_ARRAY, []);
		dmeGameParticleSystem.createAttribute('controlModels', AT_ELEMENT_ARRAY, []);
		return dmeGameParticleSystem;
	}

	createDmeMaterial(mtlName: string) {
		//colorTintBase = colorTintBase || vec4.fromValues(255, 255, 255, 255)/*'255 255 255 255'*/;

		// remove material path
		const name = mtlName.replace(/\//g, '\\').toLowerCase().replace(/^(.*)\\/, '');

		const dmeMaterial = DataModel.createElement(undefined, 'DmeMaterial', name);
		dmeMaterial.createAttribute('mtlName', AT_STRING, mtlName);
		//dmeMaterial.createAttribute('$cloakfactor', AT_FLOAT, 0);
		//dmeMaterial.createAttribute('$cloakcolortint', AT_COLOR, vec4.fromValues(255, 255, 255, 255)/*'255 255 255 255'*/);
		//dmeMaterial.createAttribute('$colortint_base', AT_COLOR, colorTintBase);

		return dmeMaterial;
	}

	addGameModelMaterial(gameModel: DmElement, material: DmElement) {
		if (gameModel) {
			const materials = gameModel.findAttribute('materials');
			if (materials) {
				materials.setValue(materials.getValue().concat(material));//TODO
			} else {
				gameModel.createAttribute('materials', AT_ELEMENT_ARRAY, [material]);
			}
		}
	}

	#createDmeControlGroup(name?: string, children: DmElement[] = [], controls: DmElement[] = []) {
		//children = (children instanceof Array) ? children : [];
		//controls = (controls instanceof Array) ? controls : [];
		const dmeControlGroup = DataModel.createElement(undefined, 'DmeControlGroup', name);
		dmeControlGroup.createAttribute('children', AT_ELEMENT_ARRAY, children);
		dmeControlGroup.createAttribute('controls', AT_ELEMENT_ARRAY, controls);


		dmeControlGroup.createAttribute('groupColor', AT_COLOR, vec4.fromValues(0, 128, 255, 255)/*'0 128 255 255'*/);
		dmeControlGroup.createAttribute('controlColor', AT_COLOR, vec4.fromValues(200, 200, 200, 255)/*'200 200 200 255'*/);
		dmeControlGroup.createAttribute('visible', AT_BOOL, true);
		dmeControlGroup.createAttribute('selectable', AT_BOOL, true);
		dmeControlGroup.createAttribute('snappable', AT_BOOL, true);

		return dmeControlGroup;
	}

	createAnimSetForModel(name: string, modelPath: string, dynamicProp: Source1ModelInstance, position: vec3, quaternion: quat, parentGameModel: DmElement | undefined, viewTargetPos?: vec3) {
		modelPath = modelPath.replace(/\.mdl$/, '') + '.mdl';
		const sourceModel = dynamicProp.sourceModel;
		if (!(sourceModel instanceof SourceModel)) {
			return null;
		}

		const gameModel = this.#createDmeGameModel(name, modelPath, undefined, undefined, Number(dynamicProp.skin), sourceModel.getBodyNumber(dynamicProp.getBodyGroups()));

		const gameModelRootControlGroup = this.#createDmeControlGroup();
		const animSet = this.#createDmeAnimationSet(name, [], gameModelRootControlGroup);

		animSet.createAttribute('gameModel', AT_ELEMENT, gameModel);
		const channelsClip = this.#createDmeChannelsClip(name, this.#createDmeTimeFrame(), []);
		const pyro1 = this.createDmeDag(name, this.#createDmeTransform(), [gameModel]);
		pyro1.setAttributeValue('visible', dynamicProp.visible);

		const animSetControls = animSet.findAttribute('controls');

		this.#pushAnimSet(animSet);
		this.#pushChannelsClip(channelsClip);
		this.#pushDagToScene(pyro1);

		this.#createGameModelFlexes(gameModel, animSet, sourceModel, channelsClip, animSetControls);

		const rootTransform = this.#createBoneTransform(animSet, 'rootTransform', 'rootTransform', position, quaternion, channelsClip.findAttribute('channels'), animSetControls);
		const rootTransformDag = this.createDmeDag('rootTransform', rootTransform, []);
		//gameModel.findAttribute('children').pushValue(rootTransformDag);

		gameModel.findAttribute('transform')?.setValue(rootTransform);

		this.#createGameModelBones(gameModel, animSet, dynamicProp, parentGameModel, channelsClip, animSetControls);

		{
			const viewTargetTransform = this.#createBoneTransform(animSet, 'viewTarget', 'viewTarget', viewTargetPos/*[0, -600, -192]*/, quat.create(), channelsClip.findAttribute('channels'), animSetControls);
			const viewTargetDag = this.createDmeDag('viewTarget', viewTargetTransform, []);
			gameModel.findAttribute('children')?.pushValue(viewTargetDag);
			gameModel.createAttribute('viewTargetDag', AT_ELEMENT, viewTargetDag);
		}

		if (parentGameModel) {
			this.makeChild(gameModel, parentGameModel)
		}
		return gameModel;
	}

	#getGameModelControlGroup(gameModel: DmElement, controlName: string) {
		const defaultControlGroupName = 'Unknown';
		const defaultAnimationGroups = SfmSession.defaultAnimationGroups;


		const controlsGroupName = this.#getGameModelControlGroup2(defaultAnimationGroups?.groupFile as JSONObject, controlName) ?? defaultControlGroupName;
		const controlsGroupArray = controlsGroupName.split('.');

		const currentControlGroup = gameModel.findAttribute('rootControlGroup')?.getValue();
		const controlGroup = this.#getControlGroup(currentControlGroup, controlsGroupArray);

		return controlGroup;
	}

	#getControlGroup(dmeControlGroup: DmElement, controlName: string[]): DmElement {
		const currentControlName = controlName[0];
		if (currentControlName == '') {
			return this.#getControlGroup(dmeControlGroup, controlName.slice(1));
		}

		const childrenArray = dmeControlGroup.findAttribute('children')?.getValue();
		for (let i = 0; i < childrenArray.length; ++i) {
			const child = childrenArray[i];
			if (child.findAttribute('name').getValue() == currentControlName) {
				if (controlName.length == 1) {
					// No more level
					return child;
				}
				return this.#getControlGroup(child, controlName.slice(1));
			}
		}
		const controlGroup = this.#createDmeControlGroup(currentControlName);
		dmeControlGroup.findAttribute('children')?.pushValue(controlGroup);

		if (controlName.length == 1) {
			// No more level
			return controlGroup;
		}
		return this.#getControlGroup(controlGroup, controlName.slice(1));
	}


	#getGameModelControlGroup2(currentLevel: JSONObject | undefined/*TODO: improve type*/, controlName: string): string | null {
		for (const i in currentLevel) {
			const sub = currentLevel[i];
			if (typeof sub == 'object') {
				//if (Array.isArray(sub)) {
				//console.log(i, sub);
				if (i == 'control' && Array.isArray(sub)) {
					for (let j = 0; j < sub.length; ++j) {
						if (sub[j] as string == controlName) {
							return '';
						}
					}
				} else {
					const result = this.#getGameModelControlGroup2(sub as JSONObject, controlName);
					if (result !== null) {
						return '.' + i + result;
					}
				}
			}
		}
		return null;
	}

	async getDefaultAnimationGroups() {
		if (SfmSession.defaultAnimationGroups) {
			return SfmSession.defaultAnimationGroups;
		}

		/*var callback = function (defaultAnimationGroups) {
			SfmSession.defaultAnimationGroups = SfmSession.defaultAnimationGroups;
			return defaultAnimationGroups;
		}*/

		//var defaultAnimationGroups = JSONSyncRequest('./assets/json/sfm_defaultanimationgroups.json');
		//let response = await fetch(new Request(SFM_DEFAULT_ANIMATION_GROUPS_URL));
		//let defaultAnimationGroups = await response.json();
		SfmSession.defaultAnimationGroups = SFM_DEFAULT_ANIMATION_GROUPS_URL;

		//return JSONSyncRequest('./assets/json/sfm_defaultanimationgroups.json', callback);
		return SfmSession.defaultAnimationGroups;
	}

	createAnimSetForCamera(name: string, camera: DmElement) {
		const animSetControlArray: DmElement[] = [];
		const channelArray: DmElement[] = [];

		const controlGroup = this.#createDmeControlGroup('all', undefined, animSetControlArray);
		const rootControlGroup = this.#createDmeControlGroup(undefined, [controlGroup]);
		const animSet = this.#createDmeAnimationSet(name, animSetControlArray, rootControlGroup/*, camera*/);
		animSet.createAttribute('camera', AT_ELEMENT, camera);

		const channelsClip = this.#createDmeChannelsClip(name, this.#createDmeTimeFrame(name, -5, 70), channelArray);

		for (let i = 0; i < cameraChannels.length; ++i) {
			const cameraChannel = cameraChannels[i];

			const scaleOperator = this.createRescaleOperator(cameraChannel.name + '_rescale', cameraChannel.result, cameraChannel.lo, cameraChannel.hi);

			const source = DataModel.createElement(undefined, 'DmElement', cameraChannel.name);

			const channel = this.#createDmeChannel(cameraChannel.name, source, 'value', 0, scaleOperator, 'value', 0, 1);
			source.createAttribute('channel', AT_ELEMENT, channel);

			const value = (cameraChannel.result - cameraChannel.lo) / (cameraChannel.hi - cameraChannel.lo);
			const defaultValue = cameraChannel.defaultValue;
			source.createAttribute('value', AT_FLOAT, value);//TODO
			source.createAttribute('defaultValue', AT_FLOAT, defaultValue);//TODO

			const scaleChannel = this.#createDmeChannel('scaled_' + cameraChannel.name + '_channel', scaleOperator, 'result', 0, camera, cameraChannel.name, 0, 1);

			const scaleChannelLog = this.#createDmeTypedLog(AT_FLOAT, 'float log', [], []);
			scaleChannel.createAttribute('log', AT_ELEMENT, scaleChannelLog);

			//animSet.findAttribute('controls').pushValue(source);
			animSetControlArray.push(source);
			animSet.findAttribute('operators')?.pushValue(scaleOperator);
			channelsClip.findAttribute('channels')?.pushValue(channel);
			channelsClip.findAttribute('channels')?.pushValue(scaleChannel);
		}


		/****************/
		const cameraTransformControl = this.#createDmeTransformControl('transform');
		const systemTransform = camera.findAttribute('transform')?.value;

		const transformPosChannel = this.#createDmeChannel('transform_pos', cameraTransformControl, 'valuePosition', 0, systemTransform, 'position', 0, 3);
		const transformRotChannel = this.#createDmeChannel('transform_rot', cameraTransformControl, 'valueOrientation', 0, systemTransform, 'orientation', 0, 3);

		const transformPosChannelLog = this.#createDmeTypedLog(AT_VECTOR3, 'vector3 log', [0], [systemTransform.findAttribute('position').value]);
		transformPosChannel.createAttribute('log', AT_ELEMENT, transformPosChannelLog);

		const transformRotChannelLog = this.#createDmeTypedLog(AT_QUATERNION, 'quaternion log', [0], [systemTransform.findAttribute('orientation').value]);
		transformRotChannel.createAttribute('log', AT_ELEMENT, transformRotChannelLog);

		cameraTransformControl.createAttribute('positionChannel', AT_ELEMENT, transformPosChannel);
		cameraTransformControl.createAttribute('orientationChannel', AT_ELEMENT, transformRotChannel);

		animSetControlArray.push(cameraTransformControl);
		channelsClip.findAttribute('channels')?.pushValue(transformPosChannel);
		channelsClip.findAttribute('channels')?.pushValue(transformRotChannel);
		/****************/

		this.#pushChannelsClip(channelsClip);
		this.#pushAnimSet(animSet);
		return animSet;
	}

	#createExpressionOperator(name: string, result: number, expr: string, spewresult: boolean) {
		const dmeExpressionOperator = DataModel.createElement(undefined, 'DmeExpressionOperator', name);
		dmeExpressionOperator.createAttribute('result', AT_FLOAT, result);
		dmeExpressionOperator.createAttribute('expr', AT_STRING, expr);
		dmeExpressionOperator.createAttribute('spewresult', AT_BOOL, spewresult);

		return dmeExpressionOperator;
	}


	createRescaleOperator(name: string, result: number, lo: number, hi: number) {
		const rescaleOperator = this.#createExpressionOperator(name + '_rescale', result, 'lerp(value, lo, hi)', false)

		const value = (result - lo) / (hi - lo);

		rescaleOperator.createAttribute('value', AT_FLOAT, value);
		rescaleOperator.createAttribute('lo', AT_FLOAT, lo);
		rescaleOperator.createAttribute('hi', AT_FLOAT, hi);

		return rescaleOperator;
	}

	#pushAnimSet(animSet: DmElement) {
		const animationSets = this.filmShot1?.findAttribute('animationSets');
		if (animationSets) {
			animationSets.getValue().push(animSet);
		} else {
			console.error('Attribute animationSets not found');
		}
	}


	#pushChannelsClip(channelsClip: DmElement) {
		const children = this.animSetEditorChannels?.findAttribute('children');
		if (children) {
			children.getValue().unshift(channelsClip);//TODO: push end
		} else {
			console.error('Attribute children not found');
		}
	}

	#pushDagToScene(dag: DmElement) {
		const children = this.scene?.findAttribute('children');
		if (children) {
			children.getValue().push(dag);
		} else {
			console.error('Attribute children not found');
		}
	}

	createAnimSetForParticleSystem(name: string, _: undefined, systemName: string, parentGameModel: DmElement, boneName: string, controlPoints: ControlPoint[]) {
		boneName = boneName || 'rootTransform';
		const systemTransform = this.#createDmeTransform(undefined);
		const gameModel = this.createDmeGameParticleSystem(name, systemName, systemTransform);

		const control1 = this.#createDmeTransformControl('transform');

		const controlPointsArray = [];
		const controlPointsDagArray = [];
		const transfomControlArray = [control1];
		const channelArray = [];
		for (let i = 0; i <= 9; ++i) {
			const cpName = 'controlPoint' + i;

			const transformX = this.#createDmeTransform(cpName);
			const transformControlX = this.#createDmeTransformControl(cpName);

			const controlPointXPosChannel = this.#createDmeChannel('controlPoint' + i + '_pos', transformControlX, 'valuePosition', 0, transformX, 'position', 0, 3);
			const controlPointXRotChannel = this.#createDmeChannel('controlPoint' + i + '_rot', transformControlX, 'valueOrientation', 0, transformX, 'orientation', 0, 3);

			const controlPointXPosChannelLog = this.#createDmeTypedLog(AT_VECTOR3, 'vector3 log', [], []);
			controlPointXPosChannel.createAttribute('log', AT_ELEMENT, controlPointXPosChannelLog);

			const controlPointXRotChannelLog = this.#createDmeTypedLog(AT_QUATERNION, 'quaternion log', [], []);
			controlPointXRotChannel.createAttribute('log', AT_ELEMENT, controlPointXRotChannelLog);

			transformControlX.createAttribute('positionChannel', AT_ELEMENT, controlPointXPosChannel);
			transformControlX.createAttribute('orientationChannel', AT_ELEMENT, controlPointXRotChannel);
			const dmeDagControlPointX = this.createDmeDag(cpName, transformX, undefined);

			controlPointsArray.push(transformX);
			controlPointsDagArray.push(dmeDagControlPointX);
			transfomControlArray.push(transformControlX);
			channelArray.push(controlPointXPosChannel, controlPointXRotChannel);

			const controlPoint = controlPoints[i];
			//if (i && controlPoint && controlPoint.currentPosition) {
			//controlPointXPosChannelLog.createAttribute('defaultValue', AT_VECTOR3, controlPoint.currentPosition);
			//controlPointXPosChannelLog.findAttribute('defaultvalue').setValue(controlPoint.currentPosition);
			//controlPointXPosChannelLog.findAttribute('usedefaultvalue').setValue(true);
			//}
			if (controlPoint) {
				/*
				var head = this.#findBone(parentGameModel, controlPoint.attachmentName);
				if (head) {
					dmeDagControlPointX.createAttribute('overrideParent', AT_ELEMENT, head);
					dmeDagControlPointX.createAttribute('overridePos', AT_BOOL, true);
					dmeDagControlPointX.createAttribute('overrideRot', AT_BOOL, true);
				}
				*/
			}
		}

		const pyroGameModelBodyControlGroup = this.#createDmeControlGroup('all', undefined, transfomControlArray/*[control1, control2, control9]*/);
		const gameModelRootControlGroup = this.#createDmeControlGroup(undefined, [pyroGameModelBodyControlGroup]);

		const animSet = this.#createDmeAnimationSet(name, transfomControlArray, gameModelRootControlGroup/*, gameModel*/);

		/*****************/
		/* Channels */
		/*****************/
		//createDmeChannel = function(name, fromElement, fromAttribute, fromIndex, toElement, toAttribute, toIndex, mode) {
		const emittingChannel = this.#createDmeChannel('emitting channel', gameModel, 'emitting', 0, gameModel, 'emitting', 0, 3);
		const visibleChannel = this.#createDmeChannel('visible channel', gameModel, 'visible', 0, gameModel, 'visible', 0, 3);
		const simulatingChannel = this.#createDmeChannel('simulating channel', gameModel, 'simulating', 0, gameModel, 'simulating', 0, 3);

		/****************/
		const transformPosChannel = this.#createDmeChannel('transform_pos', control1, 'valuePosition', 0, systemTransform, 'position', 0, 3);
		const transformRotChannel = this.#createDmeChannel('transform_rot', control1, 'valueOrientation', 0, systemTransform, 'orientation', 0, 3);

		const transformPosChannelLog = this.#createDmeTypedLog(AT_VECTOR3, 'vector3 log', [], []);
		transformPosChannel.createAttribute('log', AT_ELEMENT, transformPosChannelLog);

		const transformRotChannelLog = this.#createDmeTypedLog(AT_QUATERNION, 'quaternion log', [], []);
		transformRotChannel.createAttribute('log', AT_ELEMENT, transformRotChannelLog);

		control1.createAttribute('positionChannel', AT_ELEMENT, transformPosChannel);
		control1.createAttribute('orientationChannel', AT_ELEMENT, transformRotChannel);
		/****************/

		const emittingLog = this.#createDmeTypedLog(AT_BOOL, 'bool log', [0, 1.0, 65.0, 65.0001], [0, 1, 1, 0]);
		const visibleLog = this.#createDmeTypedLog(AT_BOOL, 'bool log', [0, 1.0, 65.0, 65.0001], [0, 1, 1, 0]);
		const similatingLog = this.#createDmeTypedLog(AT_BOOL, 'bool log', [0, 1.0, 65.0, 65.0001], [0, 1, 1, 0]);

		emittingChannel.createAttribute('log', AT_ELEMENT, emittingLog);
		visibleChannel.createAttribute('log', AT_ELEMENT, visibleLog);
		simulatingChannel.createAttribute('log', AT_ELEMENT, similatingLog);


		const channelsClip = this.#createDmeChannelsClip(name, this.#createDmeTimeFrame(name, -5, 70),
			[emittingChannel, visibleChannel, simulatingChannel, transformPosChannel, transformRotChannel].concat(channelArray)
		);
		/*****************/

		let head = this.#findBone(parentGameModel, boneName);//.findAttribute('transform');
		console.error(head);
		if (!head) {
			head = parentGameModel;
		}

		gameModel.createAttribute('children', AT_ELEMENT_ARRAY, controlPointsDagArray/*[dmeDagControlPoint0, dmeDagControlPoint9]*/);
		gameModel.createAttribute('controlPoints', AT_ELEMENT_ARRAY, controlPointsArray/*[transformControlPoint0, transformControlPoint9]*/);

		const cp0 = controlPointsDagArray[0];
		cp0.createAttribute('overrideParent', AT_ELEMENT, head);
		cp0.createAttribute('overridePos', AT_BOOL, true);
		cp0.createAttribute('overrideRot', AT_BOOL, true);

		const pyro1 = this.createDmeDag(name, this.#createDmeTransform(), [gameModel]);
		/************/

		this.#pushAnimSet(animSet);
		this.#pushChannelsClip(channelsClip);
		this.#pushDagToScene(pyro1);

		animSet.createAttribute('particle system', AT_ELEMENT, gameModel);
		//animSet.createAttribute('particleFiles', AT_STRING_ARRAY, [fileName]);

		return gameModel;
	}

	makeChild(gameModel: DmElement, parentGameModel: DmElement) {
		gameModel.createAttribute('overrideParent', AT_ELEMENT, parentGameModel);
		gameModel.createAttribute('overridePos', AT_BOOL, true);
		gameModel.createAttribute('overrideRot', AT_BOOL, true);

		const childArray: DmElement[] = gameModel.findAttribute('children')?.getValue();
		for (let i = 0; i < childArray.length; i++) {
			this.#linkBoneChild(childArray[i], parentGameModel);
		}
	}

	#getBoneName(element: DmElement) {
		const elementName = element.findAttribute('name')?.getValue();

		const result = /^bone \d* \((.*)\)$/.exec(elementName);
		if (result && result[1]) {
			return result[1];
		}

		return elementName;
	}



	#linkBoneChild(bone: DmElement, parentGameModel: DmElement) {
		const boneName = this.#getBoneName(bone);
		const parentBone = this.#findBone(parentGameModel, boneName);
		if (parentBone) {
			bone.createAttribute('overrideParent', AT_ELEMENT, parentBone);
			bone.createAttribute('overridePos', AT_BOOL, true);
			bone.createAttribute('overrideRot', AT_BOOL, true);

			const transform = bone.findAttribute('transform')?.getValue();
			vec3.zero(transform.findAttribute('position').getValue());
			vec4.zero(transform.findAttribute('orientation').getValue());
		}

		const children = bone.findAttribute('children');
		if (children) {
			const childArray = children.getValue();
			if (childArray) {
				for (let i = 0; i < childArray.length; i++) {
					const child = childArray[i];
					this.#linkBoneChild(child, parentGameModel);

				}
			}
		}
	}

	#findBone(gameModel: DmElement, boneName: string): DmElement | null {
		const children = gameModel.findAttribute('children');
		if (children) {
			const childArray: DmElement[] = children.getValue();
			if (childArray) {
				for (let i = 0; i < childArray.length; i++) {
					const child = childArray[i];
					if (child) {
						const bn = this.#getBoneName(child);//child.findAttribute('name').getValue();
						if (bn == boneName) {
							return child;
						}

						const found = this.#findBone(child, boneName);
						if (found) {
							return found;
						}
					}
				}
			}
		}
		return null;
	}

	#createGameModelBones(gameModel: DmElement, animSet: DmElement, dynamicProp: Source1ModelInstance, parentGameModel: DmElement | undefined, channelsClip: DmElement, animSetControls?: DmAttribute) {
		const boneTmp = new Map<Bone, DmElement>();
		//const boneTmp2 = new Map<string, number>();
		const elementArray: DmElement[] = [];
		const transformArray: DmElement[] = [];
		const sourceModel = dynamicProp.sourceModel;
		const boneArray = dynamicProp.skeleton?._bones;//sourceModel.getBones() || [];
		//var boneArrayLength = boneArray.length;
		let illumPositionDag = null;

		//console.error(boneArray);
		//console.error(dynamicProp.bonesScale);

		let usedBoneIndex = 0;
		if (boneArray) {
			for (let boneIndex = 0, boneArrayLength = boneArray.length; boneIndex < boneArrayLength; ++boneIndex) {
				const bone = boneArray[boneIndex];
				//if (bone && ((bone.flags & BONE_USED_MASK) > BONE_USED_BY_VERTEX_LOD0 * 0)) {
				if (bone) {
					const boneName = 'bone ' + usedBoneIndex++ + ' (' + bone.name + ')';

					const boneName2 = bone.name;
					//boneTmp2.set(boneName2, boneIndex);

					let bonePos, boneQuat;

					if (bone.parent instanceof Skeleton) {
						bonePos = bone.worldPos;
						boneQuat = bone.worldQuat;
					} else {
						bonePos = bone.position;//vec3.sub(vec3.create(), bone.worldPos, bone.parent.worldPos)//bone.position;
						boneQuat = bone.quaternion;
					}

					const boneScale = bone.scale[0]//TODO: set 3D scale;
					const boneTransform = this.#createBoneTransform(animSet, boneName, boneName2, bonePos, boneQuat, channelsClip.findAttribute('channels'), animSetControls, boneScale);

					const boneDmeDag = this.createDmeDag(boneName, boneTransform, []);
					boneTmp.set(bone, boneDmeDag);
					if (!illumPositionDag) {
						illumPositionDag = boneDmeDag;
					}

					transformArray.push(boneTransform);

					if (bone.parent instanceof Skeleton) {
						elementArray.push(boneDmeDag);
					} else {
						const children = boneTmp.get(bone.parent as Bone)?.findAttribute('children');
						if (children) {
							children.getValue().push(boneDmeDag);
						}
					}
				}
			}
		}

		const boneArray2 = sourceModel.getAttachments();
		const mdlBones = sourceModel.getBones();
		if (boneArray2 && mdlBones) {
			for (let boneIndex = 0, boneArrayLength = boneArray2.length; boneIndex < boneArrayLength; ++boneIndex) {
				const bone = boneArray2[boneIndex];
				if (bone/* && ((bone.flags & BONE_USED_MASK) > BONE_USED_BY_VERTEX_LOD0 * 0)*/) {
					const boneName2 = /*'atta_' + */bone.name;
					const boneName = 'bone ' + usedBoneIndex++ + ' (' + boneName2 + ')';


					let bonePos, boneQuat;

					/*if (-1 == bone.parentBone) {
						bonePos = bone.worldPos;
						boneQuat = bone.worldQuat;
					} else {
						bonePos = bone.position;
						boneQuat = bone.boneQuat;
					}*/
					const m = mat3.create();
					const local = bone.local;
					m[0] = local[0];
					m[1] = local[1];
					m[2] = local[2];
					m[3] = local[4];
					m[4] = local[5];
					m[5] = local[6];
					m[6] = local[8];
					m[7] = local[9];
					m[8] = local[10];

					bonePos = vec3.create();
					boneQuat = quat.create();

					bonePos = vec3.fromValues(local[3], local[7], local[11]);
					boneQuat = quat.fromMat3(quat.create(), m);

					const boneTransform = this.#createBoneTransform(animSet, boneName, boneName2, bonePos, boneQuat, channelsClip.findAttribute('channels'), animSetControls);

					const boneDmeDag = this.createDmeDag(boneName, boneTransform, []);
					//boneTmp[boneIndex] = boneDmeDag;
					if (!illumPositionDag) {
						illumPositionDag = boneDmeDag;
					}
					const attachmentBone = mdlBones[bone.localbone];
					const attachmentParentBone = dynamicProp.getBoneByName(attachmentBone?.name);

					//transformArray.push(boneTransform);

					/*if (-1 == bone.parentBone) {
						elementArray.push(boneDmeDag);
					} else {*/
					//var children// = boneTmp[boneTmp2[bone.bone.name]].findAttribute('children');TODOv2
					if (attachmentParentBone) {
						const children = boneTmp.get(attachmentParentBone)?.findAttribute('children');
						if (children) {
							children.getValue().push(boneDmeDag);
						}
					}
					//}
				}
			}
		}






		//return transformArray;
		var children = gameModel.findAttribute('bones');
		if (children) {
			children.setValue(children.getValue().concat(transformArray));//TODO
		}
		var children = gameModel.findAttribute('children');
		if (children) {
			children.setValue(children.getValue().concat(elementArray));//TODO
		}

		gameModel.createAttribute('illumPositionDag', AT_ELEMENT, illumPositionDag);
	}

	#createBoneTransform(gameModel: DmElement, boneName1: string, boneName2: string, bonePos: vec3 | undefined, boneQuat: quat, channelsClip?: DmAttribute, animSetControls?: DmAttribute, boneScale?: number) {//TODO
		const boneTransform = this.#createDmeTransform(boneName1, bonePos, boneQuat, boneScale);
		const boneTransformControl = this.#createDmeTransformControl(boneName2);

		const bonePosChannel = this.#createDmeChannel(boneName2 + '_p', boneTransformControl, 'valuePosition', 0, boneTransform, 'position', 0, 3);
		const boneRotChannel = this.#createDmeChannel(boneName2 + '_o', boneTransformControl, 'valueOrientation', 0, boneTransform, 'orientation', 0, 3);
		if (boneScale !== undefined) {
			const boneScaleChannel = this.#createDmeChannel(boneName2 + '_scale', boneTransformControl, 'value', 0, boneTransform, 'value', 0, 3);
			boneTransformControl.createAttribute('scaleChannel', AT_ELEMENT, boneScaleChannel);
			channelsClip?.getValue().push(boneScaleChannel);
			const boneTransformControlScale = this.#createDmeScaleControl(boneName2 + '_scale', 1, boneScaleChannel);

			const transformScaleChannelLog = this.#createDmeTypedLog(AT_FLOAT, 'float log', [0], [1]);
			boneScaleChannel.createAttribute('log', AT_ELEMENT, transformScaleChannelLog);

			const cameraChannel = boneScaleChannel;
			const minScale = 0;
			const maxScale = 10;
			const resultScale = boneScale;

			const scaleOperator = this.createRescaleOperator(boneName2 + '_scale', resultScale, minScale, maxScale);

			const source = DataModel.createElement(undefined, 'DmElement', boneName2 + '_scale');

			const channel = this.#createDmeChannel(boneName2, source, 'value', 0, scaleOperator, 'value', 0, 1);
			source.createAttribute('channel', AT_ELEMENT, channel);

			const value = (resultScale - minScale) / (maxScale - minScale);
			const defaultValue = 0.1;
			source.createAttribute('value', AT_FLOAT, value);//TODO
			source.createAttribute('defaultValue', AT_FLOAT, defaultValue);//TODO

			const scaleChannel = this.#createDmeChannel('scaled_' + boneName2 + '_scale_channel', scaleOperator, 'result', 0, boneTransform, 'scale', 0, 1);

			const scaleChannelLog = this.#createDmeTypedLog(AT_FLOAT, 'float log', [], []);
			scaleChannel.createAttribute('log', AT_ELEMENT, scaleChannelLog);

			//animSet.findAttribute('controls').pushValue(source);
			//animSetControlArray.push(source);
			animSetControls?.getValue().push(source);
			gameModel.findAttribute('operators')?.pushValue(scaleOperator);
			channelsClip?.getValue().push(channel);
			channelsClip?.getValue().push(scaleChannel);

			const controlGroup = this.#getGameModelControlGroup(gameModel, boneName2);//TODO

			controlGroup.findAttribute('controls')?.pushValue(boneTransformControlScale);

		}

		boneTransformControl.createAttribute('positionChannel', AT_ELEMENT, bonePosChannel);
		boneTransformControl.createAttribute('orientationChannel', AT_ELEMENT, boneRotChannel);

		channelsClip?.getValue().push(bonePosChannel);
		channelsClip?.getValue().push(boneRotChannel);

		animSetControls?.getValue().push(boneTransformControl);


		const transformPosChannelLog = this.#createDmeTypedLog(AT_VECTOR3, 'vector3 log', [0], [bonePos]);
		bonePosChannel.createAttribute('log', AT_ELEMENT, transformPosChannelLog);

		const transformRotChannelLog = this.#createDmeTypedLog(AT_QUATERNION, 'quaternion log', [0], [boneQuat]);
		boneRotChannel.createAttribute('log', AT_ELEMENT, transformRotChannelLog);

		const controlGroup = this.#getGameModelControlGroup(gameModel, boneName2);//TODO

		controlGroup?.findAttribute('controls')?.pushValue(boneTransformControl);

		return boneTransform;
	}



	#createGameModelFlexes(gameModel: DmElement, animSet: DmElement, sourceModel: SourceModel, channelsClip: DmElement, pyroGameModelBodyControlGroup?: DmAttribute) {
		//console.error(sourceModel);
		const flexControllersArray = sourceModel.mdl.getFlexControllers() || [];
		const flexControllersArrayLength = flexControllersArray.length;
		for (let flexControllersIndex = 0; flexControllersIndex < flexControllersArrayLength; ++flexControllersIndex) {
			const flexController = flexControllersArray[flexControllersIndex];
			if (flexController) {
				//console.error(flexController);
				const flexName = flexController.name;
				const flexType = flexController.type;

				//var flexWeight = flexType == 'eyes' ? 0.5 : 0.0;
				const flexWeight = flexController.min < 0 ? 0.5 : 0.0;//TODO: get the stereo flag from controllerui
				//var flexWeight = flexController.min < 0 ? 0.5 : SourceEngine.Models.GlobalFlexController.getControllerValue(flexName);//TODO: get the stereo flag from controllerui

				const dmeGlobalFlexControllerOperator = this.createDmeGlobalFlexControllerOperator(flexName, flexWeight, gameModel);

				const flexElement = DataModel.createElement(undefined, 'DmElement', flexName);
				flexElement.createAttribute('defaultValue', AT_FLOAT, flexWeight);
				flexElement.createAttribute('value', AT_FLOAT, flexWeight);
				const flexChannel = this.#createDmeChannel(flexName + '_flex_channel', flexElement, 'value', 0, dmeGlobalFlexControllerOperator, 'flexWeight', 0, 3);
				flexElement.createAttribute('channel', AT_ELEMENT, flexChannel);


				const flexChannelLog = this.#createDmeTypedLog(AT_FLOAT, 'float log');
				flexChannel.createAttribute('log', AT_ELEMENT, flexChannelLog);

				gameModel.findAttribute('flexWeights')?.pushValue(flexWeight);
				gameModel.findAttribute('flexnames')?.pushValue(flexName);
				gameModel.findAttribute('globalFlexControllers')?.pushValue(dmeGlobalFlexControllerOperator);
				channelsClip?.findAttribute('channels')?.pushValue(flexChannel);
				pyroGameModelBodyControlGroup?.getValue().push(flexElement);

				const controlGroup = this.#getGameModelControlGroup(animSet, flexName);//TODO

				controlGroup.findAttribute('controls')?.pushValue(flexElement);

			}
		}
		return;
	}


	createDmeTextFXClip(name: string, text: string, textColor = vec4.fromValues(255, 255, 255, 255), fontName: string) {
		//textColor = textColor || vec4.fromValues(255, 255, 255, 255);

		const dmeTextFXClip = DataModel.createElement(undefined, 'DmeTextFXClip', name);

		dmeTextFXClip.createAttribute('timeFrame', AT_ELEMENT, this.#createDmeTimeFrame());
		dmeTextFXClip.createAttribute('color', AT_COLOR, vec4.fromValues(0, 0, 0, 0));
		dmeTextFXClip.createAttribute('text', AT_STRING, text);
		dmeTextFXClip.createAttribute('mute', AT_BOOL, false);
		dmeTextFXClip.createAttribute('trackGroups', AT_ELEMENT_ARRAY, null);
		dmeTextFXClip.createAttribute('displayScale', AT_FLOAT, 1);

		dmeTextFXClip.createAttribute('horizontalAlignment', AT_INT, -1);
		dmeTextFXClip.createAttribute('verticalAlignment', AT_INT, 1);
		dmeTextFXClip.createAttribute('xOffset', AT_INT, 0);
		dmeTextFXClip.createAttribute('yOffset', AT_INT, 0);
		dmeTextFXClip.createAttribute('xSpeed', AT_INT, 0);
		dmeTextFXClip.createAttribute('ySpeed', AT_INT, 0);
		dmeTextFXClip.createAttribute('textColor', AT_COLOR, textColor);
		dmeTextFXClip.createAttribute('font', AT_STRING, fontName);

		return dmeTextFXClip;
	};

	DmeMaterialOverlayFXClip(name: string, overlayColor = vec4.fromValues(255, 255, 255, 255), materialName: string) {
		//overlayColor = overlayColor || vec4.fromValues(255, 255, 255, 255);

		const dmeMaterialOverlayFXClip = DataModel.createElement(undefined, 'DmeMaterialOverlayFXClip', name);

		dmeMaterialOverlayFXClip.createAttribute('timeFrame', AT_ELEMENT, this.#createDmeTimeFrame());
		dmeMaterialOverlayFXClip.createAttribute('color', AT_COLOR, vec4.fromValues(0, 0, 0, 0));
		dmeMaterialOverlayFXClip.createAttribute('text', AT_STRING, null);
		dmeMaterialOverlayFXClip.createAttribute('mute', AT_BOOL, false);
		dmeMaterialOverlayFXClip.createAttribute('trackGroups', AT_ELEMENT_ARRAY, null);
		dmeMaterialOverlayFXClip.createAttribute('displayScale', AT_FLOAT, 1);
		dmeMaterialOverlayFXClip.createAttribute('material', AT_STRING, materialName);
		dmeMaterialOverlayFXClip.createAttribute('overlaycolor', AT_COLOR, overlayColor);

		dmeMaterialOverlayFXClip.createAttribute('left', AT_INT, 0);
		dmeMaterialOverlayFXClip.createAttribute('top', AT_INT, 0);
		dmeMaterialOverlayFXClip.createAttribute('width', AT_INT, 1);
		dmeMaterialOverlayFXClip.createAttribute('height', AT_INT, 1);
		dmeMaterialOverlayFXClip.createAttribute('fullscreen', AT_BOOL, 1);
		dmeMaterialOverlayFXClip.createAttribute('useSubRect', AT_BOOL, 0);
		dmeMaterialOverlayFXClip.createAttribute('movementAngle', AT_FLOAT, 0);
		dmeMaterialOverlayFXClip.createAttribute('movementSpeed', AT_FLOAT, 0);
		dmeMaterialOverlayFXClip.createAttribute('subRectLeft', AT_INT, 0);
		dmeMaterialOverlayFXClip.createAttribute('subRectTop', AT_INT, 0);
		dmeMaterialOverlayFXClip.createAttribute('subRectWidth', AT_INT, 0);
		dmeMaterialOverlayFXClip.createAttribute('subRectHeight', AT_INT, 0);

		return dmeMaterialOverlayFXClip;
	};

	addLight(lightName: string, cameraPos: vec3, cameraOrientation: quat/*lookAt*/) {
		this.#createDmeProjectedLight(lightName);

		const gameModelRootControlGroup = this.#createDmeControlGroup();

		const result = this.#createAnimSetFromTemplate('DmeProjectedLight', lightName);
		const animSet = result[0];
		const light = result[1];
		animSet?.createAttribute('light', AT_ELEMENT, light);

		//cameraOrientation = LookAt(cameraPos, lookAt, [0, 0, 1]);
		const lightTransform = this.#createDmeTransform(undefined, cameraPos, cameraOrientation);
		light?.findAttribute('transform')?.setValue(lightTransform);

		this.lightsDag = this.lightsDag ?? function (e) { const a = e.createDmeDag('Lights', e.#createDmeTransform(), []); e.#pushDagToScene(a); return a; }(this);

		this.lightsDag.findAttribute('children')?.pushValue(light);


		return result;
	}


	#createDmeProjectedLight(lightName: string/*, lightOptions*/) {
		//lightOptions = lightOptions || {};


		return this.#createElementFromTemplate('DmeProjectedLight', lightName);
		/*



			var dmeProjectedLight = DataModel.createElementNew('DmeProjectedLight');
			dmeGameModel.createAttribute('transform', AT_ELEMENT, transform);
			dmeGameModel.createAttribute('shape', AT_ELEMENT, null);
			dmeGameModel.createAttribute('visible', AT_BOOL, true);

			dmeGameModel.createAttribute('children', AT_ELEMENT_ARRAY, lightOptions.children);
			dmeGameModel.createAttribute('color', AT_ELEMENT_ARRAY, lightOptions.children);





			dmeGameModel.createAttribute('flexWeights', AT_FLOAT_ARRAY, null);
			dmeGameModel.createAttribute('modelName', AT_STRING, modelName);
			dmeGameModel.createAttribute('skin', AT_INT, skin);
			dmeGameModel.createAttribute('body', AT_INT, bodyGroups);
			dmeGameModel.createAttribute('sequence', AT_INT, 0);
			dmeGameModel.createAttribute('flags', AT_INT, 0);
			dmeGameModel.createAttribute('bones', AT_ELEMENT_ARRAY, bones);
			dmeGameModel.createAttribute('globalFlexControllers', AT_ELEMENT_ARRAY, null);
			dmeGameModel.createAttribute('computeBounds', AT_BOOL, true);
			dmeGameModel.createAttribute('evaluateProceduralBones', AT_BOOL, true);
			dmeGameModel.createAttribute('flexnames', AT_STRING_ARRAY, null);
			dmeGameModel.createAttribute('illumPositionDag', AT_ELEMENT, null);
			dmeGameModel.createAttribute('localViewTargetFactor', AT_FLOAT, null);
			dmeGameModel.createAttribute('eyes_convergence', AT_FLOAT, null);

			return dmeGameModel;
		**/
	}

	#createAnimSetFromTemplate(elementType: string, elementName: string) {
		const animSet = this.#createElementFromTemplate('DmeAnimationSet', elementName);
		const element = this.#createElementFromTemplate(elementType, elementName);

		const animSetControlArray = [];
		const channelArray: DmElement[] = [];

		const channelsClip = this.#createDmeChannelsClip(elementName, this.#createDmeTimeFrame(elementName, -5, 70), channelArray);

		const templates = elementTemplates[elementType];
		const that = this;
		if (templates) {
			const templatesArray = Object.keys(templates);
			for (let templateIndex = 0; templateIndex < templatesArray.length; ++templateIndex) {
				//Object.keys(templates).forEach(function (key) {
				const attribName = templatesArray[templateIndex];
				const value = templates[attribName];

				const attribType = value[0];
				const attribValue = value[1];
				const attribChannel = value[2];

				if (attribChannel) {
					const channelRescale = attribChannel.rescale;

					if (attribName == 'transform') {
						const cameraTransformControl = this.#createDmeTransformControl('transform');
						const systemTransform = element?.findAttribute('transform')?.value;

						const transformPosChannel = this.#createDmeChannel('transform_pos', cameraTransformControl, 'valuePosition', 0, systemTransform, 'position', 0, 3);
						const transformRotChannel = this.#createDmeChannel('transform_rot', cameraTransformControl, 'valueOrientation', 0, systemTransform, 'orientation', 0, 3);

						const transformPosChannelLog = this.#createDmeTypedLog(AT_VECTOR3, 'vector3 log', [0], [systemTransform.findAttribute('position').value]);
						transformPosChannel.createAttribute('log', AT_ELEMENT, transformPosChannelLog);

						const transformRotChannelLog = this.#createDmeTypedLog(AT_QUATERNION, 'quaternion log', [0], [systemTransform.findAttribute('orientation').value]);
						transformRotChannel.createAttribute('log', AT_ELEMENT, transformRotChannelLog);

						cameraTransformControl.createAttribute('positionChannel', AT_ELEMENT, transformPosChannel);
						cameraTransformControl.createAttribute('orientationChannel', AT_ELEMENT, transformRotChannel);

						animSetControlArray.push(cameraTransformControl);
						channelsClip.findAttribute('channels')?.pushValue(transformPosChannel);
						channelsClip.findAttribute('channels')?.pushValue(transformRotChannel);

					} else {
						const sourceDmeElement = this.#createElementFromTemplate('DmElement', attribName);//DataModel.createElement(undefined, 'DmElement', chanel.name);

						let toElement = element;
						let toAttribute = attribName;
						if (channelRescale && toElement) {
							const scaleOperator = this.createRescaleOperator(attribName, channelRescale.result, channelRescale.lo, channelRescale.hi);
							const scaleChannel = this.#createDmeChannel('scaled_' + attribName + '_channel', scaleOperator, 'result', 0, toElement, attribName, 0, 1);
							toElement = scaleOperator;
							toAttribute = 'value';

							animSet?.findAttribute('operators')?.pushValue(scaleOperator);
							//channelsClip.findAttribute('channels').pushValue(channel);
							channelsClip.findAttribute('channels')?.pushValue(scaleChannel);
						} else {
							console.error('aa');
						}


						if (sourceDmeElement && toElement) {
							const dmeChannel = this.#createDmeChannel(attribType, sourceDmeElement, 'value', 0, toElement, toAttribute, 0, 1);
							sourceDmeElement.createAttribute('channel', AT_ELEMENT, dmeChannel);
							sourceDmeElement.createAttribute('value', AT_FLOAT, attribChannel.value);//TODO
							sourceDmeElement.createAttribute('defaultValue', AT_FLOAT, attribChannel.value/*defaultValue*/);//TODO


							animSetControlArray.push(sourceDmeElement);
						}
						//animSet.findAttribute('operators').pushValue(scaleOperator);
						//channelsClip.findAttribute('channels')?.pushValue(dmeChannel);
						//channelsClip.findAttribute('channels').pushValue(scaleChannel);
					}





				}
				/*if (attribType == AT_ELEMENT) {
					that.createElementFromTemplate(attribType, attribValue);
				} else {
					element.createAttribute(key, value[0], value[1]);
				}*/
			}
		}

		const controlGroup = this.#createDmeControlGroup('all', undefined, animSetControlArray);
		const rootControlGroup = this.#createDmeControlGroup(undefined, [controlGroup]);

		animSet?.setAttributeValue('controls', animSetControlArray);
		animSet?.setAttributeValue('rootControlGroup', rootControlGroup);
		//animSet.createAttribute('camera', AT_ELEMENT, camera);

		this.#pushChannelsClip(channelsClip);
		if (animSet) {
			this.#pushAnimSet(animSet);
		}

		return [animSet, element];
		/*

		var channelsClip = this.#createDmeChannelsClip(name, this.#createDmeTimeFrame(name, -5, 70), channelArray);

		for (var i = 0; i < chanels.length; ++i) {
			var chanel = chanels[i];

			var scaleOperator = this.createRescaleOperator(chanel.name + '_rescale', chanel.result, chanel.lo, chanel.hi);


			var sourceDmeElement = DataModel.createElement(undefined, 'DmElement', chanel.name);

			var dmeChannel = this.#createDmeChannel(chanel.name, sourceDmeElement, 'value', 0, scaleOperator, 'value', 0, 1);
			sourceDmeElement.createAttribute('channel', AT_ELEMENT, dmeChannel);

			var value = (chanel.result - chanel.lo) / (chanel.hi - chanel.lo);
			var defaultValue = chanel.defaultValue;
			sourceDmeElement.createAttribute('value', AT_FLOAT, value);//TODO
			sourceDmeElement.createAttribute('defaultValue', AT_FLOAT, defaultValue);//TODO

			var scaleChannel = this.#createDmeChannel('scaled_' + chanel.name + '_channel', scaleOperator, 'result', 0, camera, chanel.name, 0, 1);

			var scaleChannelLog = this.#createDmeTypedLog(AT_FLOAT, 'float log', [], []);
			scaleChannel.createAttribute('log', AT_ELEMENT, scaleChannelLog);

			//animSet.findAttribute('controls').pushValue(source);
			animSetControlArray.push(sourceDmeElement);
			animSet.findAttribute('operators').pushValue(scaleOperator);
			channelsClip.findAttribute('channels').pushValue(dmeChannel);
			channelsClip.findAttribute('channels').pushValue(scaleChannel);
		}


		/**************** /
		var cameraTransformControl = this.#createDmeTransformControl('transform');
		var systemTransform = camera.findAttribute('transform').value;

		var transformPosChannel = this.#createDmeChannel('transform_pos', cameraTransformControl, 'valuePosition', 0, systemTransform, 'position', 0, 3);
		var transformRotChannel = this.#createDmeChannel('transform_rot', cameraTransformControl, 'valueOrientation', 0, systemTransform, 'orientation', 0, 3);

		var transformPosChannelLog = this.#createDmeTypedLog(AT_VECTOR3, 'vector3 log', [0], [systemTransform.findAttribute('position').value]);
		transformPosChannel.createAttribute('log', AT_ELEMENT, transformPosChannelLog);

		var transformRotChannelLog = this.#createDmeTypedLog(AT_QUATERNION, 'quaternion log', [0], [systemTransform.findAttribute('orientation').value]);
		transformRotChannel.createAttribute('log', AT_ELEMENT, transformRotChannelLog);

		cameraTransformControl.createAttribute('positionChannel', AT_ELEMENT, transformPosChannel);
		cameraTransformControl.createAttribute('orientationChannel', AT_ELEMENT, transformRotChannel);

		animSetControlArray.push(cameraTransformControl);
		channelsClip.findAttribute('channels').pushValue(transformPosChannel);
		channelsClip.findAttribute('channels').pushValue(transformRotChannel);
		/**************** /

		this.#pushChannelsClip(channelsClip);
		return animSet;*/
	}

	#createElementFromTemplate(elementType: string, elementName: string) {
		const templates = elementTemplates[elementType];
		let element: DmElement | undefined;

		if (templates) {
			element = DataModel.createElementNew(elementType, elementName);
			Object.keys(templates).forEach((key) => {
				const value = templates[key];

				const attribType = value[0];
				const attribValue = value[1];
				if (attribType == AT_ELEMENT) {
					const childElement = this.#createElementFromTemplate(attribValue, elementName + '_' + key);
					element!.createAttribute(key, attribType, childElement);
				} else {
					element!.createAttribute(key, attribType, attribValue);
				}
			});
		}

		return element;
	};

	animSetSetControlValue(animSet: DmElement, controlName: string, value: number) {
		const controlArray = animSet.findAttribute('controls')?.value;
		for (let i = 0; i < controlArray.length; ++i) {
			const control = controlArray[i];
			const name = control.findAttribute('name').value;
			if (controlName == name) {
				//console.log(control);
				control.setAttributeValue('value', value);
			}
		}
	};

}

var cameraChannels = [
	{ name: 'fieldOfView', result: 30, lo: 10, hi: 120, defaultValue: 0.1818181872 },
	{ name: 'focalDistance', result: 72, lo: 1, hi: 200, defaultValue: 0.3567839265 },
	{ name: 'aperture', result: 0.2, lo: 0, hi: 10, defaultValue: 0.0199999996 },
	{ name: 'toneMapScale', result: 1, lo: 0.001, hi: 10, defaultValue: 0.0279027931 },
	{ name: 'bloomScale', result: 0.28, lo: 0, hi: 10, defaultValue: 0.0280000009 },
	{ name: 'SSAOBias', result: 0.0005, lo: 0, hi: 0.01, defaultValue: 0.0500000045 },
	{ name: 'SSAOStrength', result: 1, lo: 0, hi: 25, defaultValue: 0.0399999991 },
	{ name: 'SSAORadius', result: 15, lo: 0, hi: 25, defaultValue: 0.6000000238 },

	/*
'name' 'string' 'fieldOfView'
'value' 'float' '0.1818181872'
'channel' 'element' '097a8ef5-dc5b-4f00-9ac4-bc2d98c2a76f'
'defaultValue' 'float' '0.1818181872'

'name' 'string' 'focalDistance'
'value' 'float' '0.3567839265'
'channel' 'element' 'a1a58f05-ddaa-4b5c-ae05-06baebdd0e89'
'defaultValue' 'float' '0.3567839265'

'name' 'string' 'aperture'
'value' 'float' '0.0199999996'
'channel' 'element' '659a981c-3401-4802-aaa4-e8881afd4114'
'defaultValue' 'float' '0.0199999996'

'name' 'string' 'toneMapScale'
'value' 'float' '0.0999099985'
'channel' 'element' '70f9cd2c-2a6d-46b3-a572-9eaae426e28c'
'defaultValue' 'float' '0.0279027931'

'name' 'string' 'bloomScale'
'value' 'float' '0.0280000009'
'channel' 'element' '36668baa-c752-490f-951c-0b212b769eff'
'defaultValue' 'float' '0.0280000009'

'name' 'string' 'SSAOBias'
'value' 'float' '0.0500000045'
'channel' 'element' '54839a79-097e-40bb-9ade-ed1c575637ab'
'defaultValue' 'float' '0.0500000045'

'name' 'string' 'SSAOStrength'
'value' 'float' '0.0399999991'
'channel' 'element' '7de3c50a-4c3a-4203-901c-704170a85415'
'defaultValue' 'float' '0.0399999991'

'name' 'string' 'SSAORadius'
'value' 'float' '0.6000000238'
'channel' 'element' 'f89df77e-9c4d-4e83-b3ae-4226da5e7ddb'
'defaultValue' 'float' '0.6000000238'*/


	/*{name: 'scaled_fieldOfView_channel', type: 'float'},
	{name: 'scaled_focalDistance_channel', type: 'float'},
	{name: 'scaled_aperture_channel', type: 'float'},
	{name: 'scaled_toneMapScale_channel', type: 'float'},
	{name: 'scaled_bloomScale_channel', type: 'float'},
	{name: 'scaled_SSAOBias_channel', type: 'float'},
	{name: 'scaled_SSAOStrength_channel', type: 'float'},
	{name: 'scaled_SSAORadius_channel', type: 'float'},*/
	//{name: 'transform_pos', type: 'vector3'},
	//{name: 'transform_rot', type: 'vector3'},
]


elementTemplates['DmeProjectedLight'] = {
	'transform': [AT_ELEMENT, 'DmeTransform', {}],
	'shape': [AT_ELEMENT, null],
	'visible': [AT_BOOL, true],
	'children': [AT_ELEMENT_ARRAY, null],
	'color': [AT_COLOR, vec4.fromValues(255, 255, 255, 255)],
	'intensity': [AT_FLOAT, 500.0, { value: 0.5, rescale: { lo: 0, hi: 1000, result: 500 } }],
	'constantAttenuation': [AT_FLOAT, 0.0, { value: 0.0, rescale: { lo: 0, hi: 1, result: 0 } }],
	'linearAttenuation': [AT_FLOAT, 0.0, { value: 0.0, rescale: { lo: 0, hi: 1000, result: 0 } }],
	'quadraticAttenuation': [AT_FLOAT, 1500.0, { value: 0.5, rescale: { lo: 0, hi: 3000, result: 1500 } }],
	'maxDistance': [AT_FLOAT, 600.0, { value: 0.1836734712, rescale: { lo: 60, hi: 3000, result: 600 } }],
	'minDistance': [AT_FLOAT, 10.0, { value: 0.0301003344, rescale: { lo: 1, hi: 300, result: 10 } }],
	'horizontalFOV': [AT_FLOAT, 30.0, { value: 0.1818181872, rescale: { lo: 10, hi: 120, result: 30 } }],
	'verticalFOV': [AT_FLOAT, 30.0, { value: 0.1818181872, rescale: { lo: 10, hi: 120, result: 30 } }],
	'ambientIntensity': [AT_FLOAT, 0.25, { value: 0.25 }],
	'texture': [AT_STRING, 'effects//gobo_radial'],
	'radius': [AT_FLOAT, 0.0, { value: 0.0, rescale: { lo: 0, hi: 50, result: 0 } }],
	'castsShadows': [AT_BOOL, true],
	'shadowDepthBias': [AT_FLOAT, 0.08, { value: 0.08, rescale: { lo: 0, hi: 0.001, result: 0.00008 } }],
	'shadowSlopeScaleDepthBias': [AT_FLOAT, 0.2, { value: 0.2, rescale: { lo: 0, hi: 10, result: 2 } }],
	'shadowFilterSize': [AT_FLOAT, 0.125, { value: 0.125, rescale: { lo: 0, hi: 24, result: 3 } }],
	'shadowAtten': [AT_FLOAT, 1.0, { value: 1.0 }],
	'drawShadowFrustum': [AT_BOOL, false],
	'jitterSeed': [AT_FLOAT, 0.6114993691],
	'animationTime': [AT_TIME, 0.0],
	'frameRate': [AT_FLOAT, 24.0],
	'farZAtten': [AT_FLOAT, 0.25, { value: 0.25, rescale: { lo: 0, hi: 3000, result: 750 } }],
	'ambientOcclusion': [AT_FLOAT, 1.0],
	'uberlight': [AT_BOOL, false],
	'nearEdge': [AT_FLOAT, 0.4, { value: 0.4, rescale: { lo: 0, hi: 5, result: 2 } }],
	'farEdge': [AT_FLOAT, 0.5, { value: 0.5, rescale: { lo: 0, hi: 200, result: 100 } }],
	'cutOn': [AT_FLOAT, 0.05, { value: 0.05, rescale: { lo: 0, hi: 200, result: 10 } }],
	'cutOff': [AT_FLOAT, 0.5416667, { value: 0.5416667, rescale: { lo: 0, hi: 1200, result: 650 } }],
	'width': [AT_FLOAT, 0.03, { value: 0.03, rescale: { lo: 0, hi: 10, result: 0.3 } }],
	'edgeWidth': [AT_FLOAT, 0.005, { value: 0.005, rescale: { lo: 0, hi: 10, result: 0.05 } }],
	'height': [AT_FLOAT, 0.03, { value: 0.03, rescale: { lo: 0, hi: 10, result: 0.3 } }],
	'edgeHeight': [AT_FLOAT, 0.005, { value: 0.005, rescale: { lo: 0, hi: 10, result: 0.05 } }],
	'roundness': [AT_FLOAT, 0.8],
	'volumetric': [AT_BOOL, false],
	'volumetricIntensity': [AT_FLOAT, 0.1, { value: 0.1, rescale: { lo: 0, hi: 10, result: 1 } }],
	'noiseStrength': [AT_FLOAT, 0.8],
	'flashlightTime': [AT_FLOAT, 0.0],
	'numPlanes': [AT_INT, 64],
	'planeOffset': [AT_FLOAT, 0.8823529482],
	'positionJitter': [AT_VECTOR2, vec2.fromValues(0.5744000077, -0.7741000056)],

	/*
	'noiseStrength':[AT_FLOAT, 0.8],
	'flashlightTime':[AT_FLOAT, 0.0],
	'numPlanes':[AT_INT, 64],
	'planeOffset':[AT_FLOAT, 0.8823529482],
	'positionJitter':[AT_VECTOR2, vec2.fromValues(0.5744000077, -0.7741000056)],*/
}
elementTemplates['DmeAnimationSet'] = {
	'controls': [AT_ELEMENT_ARRAY, null],
	'presetGroups': [AT_ELEMENT_ARRAY, null],
	'phonememap': [AT_ELEMENT_ARRAY, null],
	'operators': [AT_ELEMENT_ARRAY, null],
	'rootControlGroup': [AT_ELEMENT, 'DmeControlGroup'],
}

elementTemplates['DmeTransform'] = {
	'position': [AT_VECTOR3, vec3.create()],
	'orientation': [AT_QUATERNION, quat.create()],
}

elementTemplates['DmElement'] = {
}



/**
 * TODO
 */
