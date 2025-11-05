
import { mat3, quat, vec2, vec3, vec4 } from 'gl-matrix';
import { Bone, ControlPoint, degToRad, Skeleton, Source1ModelInstance, SourceModel } from 'harmony-3d';
import { JSONObject } from 'harmony-types';
import SFM_DEFAULT_ANIMATION_GROUPS_URL from '../json/sfm_defaultanimationgroups.json';
import { DataModel } from './datamodel';
import { DmAttribute } from './dmattribute';
import { DmAttributeType, DmAttributeTypeFirstArray } from './dmattributetypes';
import { DmElement } from './dmelement';
import { DmSerializerKeyValues2 } from './dmserializerkeyvalues2';
import { BufferFlags, UtlBuffer } from './utlbuffer';

const CLIP_TYPE_CHANNEL = 0;
const CLIP_TYPE_AUDIO = 1;
//const CLIP_TYPE_EFFECTS = 2;
const CLIP_TYPE_FILM = 3;

//let createFilmClipId = 0;


const elementTemplates: Record<string, Record<string, any>> = {};

export function LookAt(sourcePoint: vec3, destPoint: vec3, upVector: vec3): vec4 {
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

	#populateSession(mapName: string, clipName: string): void {
		const dmeTimeSelection = this.#createDmeTimeSelection();
		const dmeSettings = DataModel.createElement(undefined, 'DmElement');
		dmeSettings.createAttribute('name', DmAttributeType.String, 'sessionSettings');
		dmeSettings.createAttribute('timeSelection', DmAttributeType.Element, dmeTimeSelection);

		const graphEditorState = DataModel.createElement(undefined, 'DmeGraphEditorState', 'graphEditorState');
		graphEditorState.createAttribute('displayGrid', DmAttributeType.Bool, true);

		//////////////////////////////////////////////////////////////////////////////////////////
		const proceduralPresets = DataModel.createElement(undefined, 'DmeProceduralPresetSettings', 'proceduralPresets');
		proceduralPresets.createAttribute('jitterscale', DmAttributeType.Float, 1);
		proceduralPresets.createAttribute('smoothscale', DmAttributeType.Float, 1);
		proceduralPresets.createAttribute('jitterscale_vector', DmAttributeType.Float, 2.5);
		proceduralPresets.createAttribute('smoothscale_vector', DmAttributeType.Float, 2.5);
		proceduralPresets.createAttribute('jitteriterations', DmAttributeType.Int, 5);
		proceduralPresets.createAttribute('smoothiterations', DmAttributeType.Int, 5);
		proceduralPresets.createAttribute('staggerinterval', DmAttributeType.Time, 0.0833);

		//////////////////////////////////////////////////////////////////////////////////////////
		const renderSettings = DataModel.createElement(undefined, 'DmElement', 'renderSettings');
		renderSettings.createAttribute('frameRate', DmAttributeType.Float, 24);
		renderSettings.createAttribute('lightAverage', DmAttributeType.Int, 0);
		renderSettings.createAttribute('modelLod', DmAttributeType.Int, 0);
		renderSettings.createAttribute('engineCameraEffects', DmAttributeType.Bool, 0);
		renderSettings.createAttribute('ambientOcclusionMode', DmAttributeType.Int, 1);
		renderSettings.createAttribute('showAmbientOcclusion', DmAttributeType.Int, 0);
		renderSettings.createAttribute('drawGameRenderablesMask', DmAttributeType.Int, 216);
		renderSettings.createAttribute('drawToolRenderablesMask', DmAttributeType.Int, 15);
		renderSettings.createAttribute('toneMapScale', DmAttributeType.Float, 1);
		const ProgressiveRefinement = DataModel.createElement(undefined, 'DmElement', 'ProgressiveRefinementSettings');
		ProgressiveRefinement.createAttribute('on', DmAttributeType.Bool, true);
		ProgressiveRefinement.createAttribute('useDepthOfField', DmAttributeType.Bool, true);
		ProgressiveRefinement.createAttribute('overrideDepthOfFieldQuality', DmAttributeType.Bool, false);
		ProgressiveRefinement.createAttribute('overrideDepthOfFieldQualityValue', DmAttributeType.Int, 1);
		ProgressiveRefinement.createAttribute('useMotionBlur', DmAttributeType.Bool, true);
		ProgressiveRefinement.createAttribute('overrideMotionBlurQuality', DmAttributeType.Bool, false);
		ProgressiveRefinement.createAttribute('overrideMotionBlurQualityValue', DmAttributeType.Int, 1);
		ProgressiveRefinement.createAttribute('useAntialiasing', DmAttributeType.Bool, true);
		ProgressiveRefinement.createAttribute('overrideShutterSpeed', DmAttributeType.Bool, false);
		ProgressiveRefinement.createAttribute('overrideShutterSpeedValue', DmAttributeType.Float, 0.020833334);
		renderSettings.createAttribute('ProgressiveRefinement', DmAttributeType.Element, ProgressiveRefinement);

		//////////////////////////////////////////////////////////////////////////////////////////
		const posterSettings = DataModel.createElement(undefined, 'DmElement', 'posterSettings');
		posterSettings.createAttribute('width', DmAttributeType.Int, 1920);
		posterSettings.createAttribute('height', DmAttributeType.Int, 1080);
		posterSettings.createAttribute('DPI', DmAttributeType.Int, 300);
		posterSettings.createAttribute('units', DmAttributeType.Int, 0);
		posterSettings.createAttribute('constrainAspect', DmAttributeType.Bool, true);
		posterSettings.createAttribute('heightInPixels', DmAttributeType.Bool, true);
		posterSettings.createAttribute('widthInPixels', DmAttributeType.Bool, true);
		posterSettings.createAttribute('format', DmAttributeType.String, 'PNG');

		//////////////////////////////////////////////////////////////////////////////////////////
		const movieSettings = DataModel.createElement(undefined, 'DmElement', 'movieSettings');
		movieSettings.createAttribute('videoTarget', DmAttributeType.Int, 6);
		movieSettings.createAttribute('audioTarget', DmAttributeType.Int, 2);
		movieSettings.createAttribute('stereoscopic', DmAttributeType.Bool, 0);
		movieSettings.createAttribute('stereoSingleFile', DmAttributeType.Bool, 0);
		movieSettings.createAttribute('clearDecals', DmAttributeType.Bool, 0);
		movieSettings.createAttribute('width', DmAttributeType.Int, 1280);
		movieSettings.createAttribute('height', DmAttributeType.Int, 720);
		movieSettings.createAttribute('filename', DmAttributeType.String, null);

		//////////////////////////////////////////////////////////////////////////////////////////
		const sharedPresetGroupSettings = DataModel.createElement(undefined, 'DmElement', 'sharedPresetGroupSettings');
		sharedPresetGroupSettings.createAttribute('presetGroupInfos', DmAttributeType.ElementArray);


		dmeSettings.createAttribute('graphEditorState', DmAttributeType.Element, graphEditorState);
		dmeSettings.createAttribute('proceduralPresets', DmAttributeType.Element, proceduralPresets);
		dmeSettings.createAttribute('renderSettings', DmAttributeType.Element, renderSettings);
		dmeSettings.createAttribute('posterSettings', DmAttributeType.Element, posterSettings);
		dmeSettings.createAttribute('movieSettings', DmAttributeType.Element, movieSettings);
		dmeSettings.createAttribute('sharedPresetGroupSettings', DmAttributeType.Element, sharedPresetGroupSettings);

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

		this.#dmeSession.createAttribute('activeClip', DmAttributeType.Element, activeClip);
		this.#dmeSession.createAttribute('miscBin', DmAttributeType.ElementArray, null);
		this.#dmeSession.createAttribute('cameraBin', DmAttributeType.ElementArray, null);
		this.#dmeSession.createAttribute('clipBin', DmAttributeType.ElementArray, [activeClip]);
		this.#dmeSession.createAttribute('name', DmAttributeType.String, 'session');
		this.#dmeSession.createAttribute('settings', DmAttributeType.Element, dmeSettings);
		/*dmeSession.createAttribute('graphEditorState', DmAttributeType.Element, graphEditorState);
		dmeSession.createAttribute('proceduralPresets', DmAttributeType.Element, proceduralPresets);
		dmeSession.createAttribute('renderSettings', DmAttributeType.Element, renderSettings);
		dmeSession.createAttribute('posterSettings', DmAttributeType.Element, posterSettings);
		dmeSession.createAttribute('movieSettings', DmAttributeType.Element, movieSettings);
		dmeSession.createAttribute('sharedPresetGroupSettings', DmAttributeType.Element, sharedPresetGroupSettings);*/
	}

	#createFilmClip(clipName: string, trackGroups: DmElement[] = [], subClipTrackGroup: DmElement | undefined, camera: never | undefined, scene: DmElement | undefined, animationSets: never[] | undefined = [], mapname: string): DmElement {
		//animationSets = (animationSets instanceof Array) ? animationSets : [];
		//++createFilmClipId;
		const dmeFilmClip = DataModel.createElement(undefined, 'DmeFilmClip', clipName/*'test' + CreateFilmClip.clipId*/);
		dmeFilmClip.createAttribute('timeFrame', DmAttributeType.Element, this.#createDmeTimeFrame());
		dmeFilmClip.createAttribute('color', DmAttributeType.Color, vec4.fromValues(0, 0, 0, 0)/*'0 255 0 255'*/);
		dmeFilmClip.createAttribute('text', DmAttributeType.String, '');
		dmeFilmClip.createAttribute('mute', DmAttributeType.Bool, false);

		// Tracks
		//trackGroups = (trackGroups instanceof Array) ? trackGroups : [];
		//subClipTrackGroup = (subClipTrackGroup instanceof Array) ? subClipTrackGroup : [];
		dmeFilmClip.createAttribute('trackGroups', DmAttributeType.ElementArray, trackGroups);
		dmeFilmClip.createAttribute('displayScale', DmAttributeType.Float, 1);
		dmeFilmClip.createAttribute('materialOverlay', DmAttributeType.Element, null);
		dmeFilmClip.createAttribute('mapname', DmAttributeType.String, mapname);
		dmeFilmClip.createAttribute('camera', DmAttributeType.Element, camera);
		dmeFilmClip.createAttribute('monitorCameras', DmAttributeType.ElementArray, []);
		dmeFilmClip.createAttribute('activeMonitor', DmAttributeType.Int, -1);
		dmeFilmClip.createAttribute('scene', DmAttributeType.Element, scene);
		dmeFilmClip.createAttribute('aviFile', DmAttributeType.String, null);
		dmeFilmClip.createAttribute('fadeIn', DmAttributeType.Time, 0);
		dmeFilmClip.createAttribute('fadeOut', DmAttributeType.Time, 0);
		dmeFilmClip.createAttribute('inputs', DmAttributeType.ElementArray, null);
		dmeFilmClip.createAttribute('operators', DmAttributeType.ElementArray, null);
		dmeFilmClip.createAttribute('useAviFile', DmAttributeType.Bool, false);
		dmeFilmClip.createAttribute('animationSets', DmAttributeType.ElementArray, animationSets);
		dmeFilmClip.createAttribute('bookmarkSets', DmAttributeType.ElementArray, null);
		dmeFilmClip.createAttribute('activeBookmarkSet', DmAttributeType.Int, 0);
		dmeFilmClip.createAttribute('subClipTrackGroup', DmAttributeType.Element, subClipTrackGroup);
		dmeFilmClip.createAttribute('volume', DmAttributeType.Float, 1);
		dmeFilmClip.createAttribute('concommands', DmAttributeType.StringArray, null);
		dmeFilmClip.createAttribute('convars', DmAttributeType.StringArray, null);

		return dmeFilmClip;
	}

	out(): string {
		const buf = new UtlBuffer(BufferFlags.TEXT_BUFFER);
		new DmSerializerKeyValues2(false).serialize(buf, this.#dmeSession);
		return buf.getBuffer();
	}

	#createDmeTimeSelection(name?: string): DmElement {
		const dmeTimeSelection = DataModel.createElement(undefined, 'DmeTimeSelection', name);
		dmeTimeSelection.createAttribute('name', DmAttributeType.String, 'timeSelection');
		dmeTimeSelection.createAttribute('enabled', DmAttributeType.Bool, true);
		dmeTimeSelection.createAttribute('relative', DmAttributeType.Bool, false);
		dmeTimeSelection.createAttribute('falloff_left', DmAttributeType.Time, -214748.3647);
		dmeTimeSelection.createAttribute('falloff_right', DmAttributeType.Time, 214748.3647);
		dmeTimeSelection.createAttribute('hold_left', DmAttributeType.Time, -214748.3647);
		dmeTimeSelection.createAttribute('hold_right', DmAttributeType.Time, 214748.3647);
		dmeTimeSelection.createAttribute('interpolator_left', DmAttributeType.Int, 6);
		dmeTimeSelection.createAttribute('interpolator_right', DmAttributeType.Int, 6);
		dmeTimeSelection.createAttribute('threshold', DmAttributeType.Float, 0.0005);
		dmeTimeSelection.createAttribute('resampleinterval', DmAttributeType.Time, 0.0100);
		dmeTimeSelection.createAttribute('recordingstate', DmAttributeType.Int, 2);
		return dmeTimeSelection;
	}

	createDmeTrack(trackName: string, children: DmElement[] = [], clipType = 0): DmElement {
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

		dmeTrack.createAttribute('children', DmAttributeType.ElementArray, children);

		dmeTrack.createAttribute('collapsed', DmAttributeType.Bool, false);
		dmeTrack.createAttribute('mute', DmAttributeType.Bool, false);
		dmeTrack.createAttribute('synched', DmAttributeType.Bool, true);
		dmeTrack.createAttribute('clipType', DmAttributeType.Int, clipType);
		dmeTrack.createAttribute('volume', DmAttributeType.Float, 1);
		dmeTrack.createAttribute('displayScale', DmAttributeType.Float, 1);

		return dmeTrack;
	}

	createDmeCamera(cameraName: string, cameraPos: vec3, cameraLookAt: vec3, rollAngle: number): DmElement {
		rollAngle = rollAngle || 0;

		const cameraOrientation = LookAt(cameraPos, cameraLookAt, [0, 0, 1]);

		// Add a roll effect
		if (rollAngle && !isNaN(rollAngle)) {
			const rollQuat = quat.setAxisAngle(quat.create(), [1, 0, 0], degToRad(rollAngle));
			quat.mul(cameraOrientation, cameraOrientation, rollQuat);
		}

		const cameraTransform = this.#createDmeTransform(undefined, cameraPos, cameraOrientation);
		const dmeCamera = DataModel.createElement(undefined, 'DmeCamera', cameraName);
		dmeCamera.createAttribute('transform', DmAttributeType.Element, cameraTransform);

		//TODO
		return dmeCamera;
	}

	createDmeGlobalFlexControllerOperator(name: string, flexWeight: number, gameModel: DmElement): DmElement {
		const dmeGlobalFlexControllerOperator = DataModel.createElement(undefined, 'DmeGlobalFlexControllerOperator', name);
		dmeGlobalFlexControllerOperator.createAttribute('flexWeight', DmAttributeType.Float, flexWeight);
		dmeGlobalFlexControllerOperator.createAttribute('gameModel', DmAttributeType.Element, gameModel);
		return dmeGlobalFlexControllerOperator;
	}

	createDmeDag(name: string, transform: DmElement, children: DmElement[] = []): DmElement {
		const dmeDag = DataModel.createElement(undefined, 'DmeDag', name);

		dmeDag.createAttribute('transform', DmAttributeType.Element, transform);
		dmeDag.createAttribute('shape', DmAttributeType.Element, null);
		dmeDag.createAttribute('visible', DmAttributeType.Bool, true);

		//children = (children instanceof Array) ? children : [];
		dmeDag.createAttribute('children', DmAttributeType.ElementArray, children);

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

	#createDmeTransform(name?: string, position = vec3.create(), orientation = quat.create(), scale?: number): DmElement {

		const dmeTransform = DataModel.createElement(undefined, 'DmeTransform', name);

		dmeTransform.createAttribute('position', DmAttributeType.Vector3, position);//TODO
		dmeTransform.createAttribute('orientation', DmAttributeType.Quaternion, orientation);//TODO
		if (scale !== undefined) {
			dmeTransform.createAttribute('scale', DmAttributeType.Float, scale);//TODO
		}

		/*'position' 'vector3' '0 0 0'
		'orientation' 'quaternion' '0 0 0 1'*/
		//TODO
		return dmeTransform;
	}

	#createDmeChannel(name: string, fromElement: DmElement, fromAttribute: string, fromIndex: number, toElement: DmElement, toAttribute: string, toIndex: number, mode: number): DmElement {
		const dmeChannel = DataModel.createElement(undefined, 'DmeChannel', name);

		dmeChannel.createAttribute('fromElement', DmAttributeType.Element, fromElement);
		dmeChannel.createAttribute('fromAttribute', DmAttributeType.String, fromAttribute);
		dmeChannel.createAttribute('fromIndex', DmAttributeType.Int, fromIndex);

		dmeChannel.createAttribute('toElement', DmAttributeType.Element, toElement);
		dmeChannel.createAttribute('toAttribute', DmAttributeType.String, toAttribute);
		dmeChannel.createAttribute('toIndex', DmAttributeType.Int, toIndex);

		dmeChannel.createAttribute('mode', DmAttributeType.Int, mode);

		dmeChannel.createAttribute('log', DmAttributeType.Element, null);

		return dmeChannel;
	}

	#getTypeName(type: DmAttributeType): string {
		switch (type) {
			/*

			var DmAttributeType.String = 5;
			var DmAttributeType.Void = 6;
			var DmAttributeType.ObjectId = 7;
			var DmAttributeType.Time = 7;
			var DmAttributeType.Color = 8; //rgba
			var DmAttributeType.Vector2 = 9;
			var DmAttributeType.Vector3 = 10;
			var DmAttributeType.Vector4 = 11;
			var DmAttributeType.QAngle = 12;
			var DmAttributeType.Quaternion = 13;
			var DmAttributeType.VMatrix = 14;
			*/
			case DmAttributeType.Int:
				return 'Int';
			case DmAttributeType.Float:
				return 'Float';
			case DmAttributeType.Bool:
				return 'Bool';
			case DmAttributeType.String:
				return 'String';
			case DmAttributeType.Time:
				return 'Time';
			case DmAttributeType.Color:
				return 'Color';
			case DmAttributeType.Vector2:
				return 'Vector2';
			case DmAttributeType.Vector3:
				return 'Vector3';
			case DmAttributeType.Vector4:
				return 'Vector4';
			case DmAttributeType.QAngle:
				return 'QAngle';
			case DmAttributeType.Quaternion:
				return 'Quaternion';
			case DmAttributeType.VMatrix:
				return 'VMatrix';
		}
		console.error('Unknown type in getTypeName ' + type);
		return '';
	}

	#createDmeTypedLog(type: DmAttributeType, name: string, times: number[] = [], values: any[] = []): DmElement {
		//times = (times instanceof Array) ? times : [];
		//values = (values instanceof Array) ? values : [];

		const elementTypeName = 'Dme' + this.#getTypeName(type) + 'Log';
		const dmeTypedLog = DataModel.createElement(undefined, elementTypeName, name);

		const dmeTypedLayer = this.#createDmeTypedLayer(type, name, times, values);

		dmeTypedLog.createAttribute('layers', DmAttributeType.ElementArray, [dmeTypedLayer]);

		dmeTypedLog.createAttribute('curveinfo', DmAttributeType.Element, null);
		dmeTypedLog.createAttribute('usedefaultvalue', DmAttributeType.Bool, false);
		dmeTypedLog.createAttribute('defaultvalue', type, null);
		if ((type == DmAttributeType.Vector3) || (type == DmAttributeType.Quaternion)) {
			dmeTypedLog.createAttribute('bookmarksX', DmAttributeType.TimeArray, []);
			dmeTypedLog.createAttribute('bookmarksY', DmAttributeType.TimeArray, []);
			dmeTypedLog.createAttribute('bookmarksZ', DmAttributeType.TimeArray, []);
		}
		dmeTypedLog.createAttribute('bookmarks', DmAttributeType.TimeArray, []);
		return dmeTypedLog;
	}

	#createDmeTypedLayer(type: number/*TODO: improve type*/, name: string, times: number[], values: any[]): DmElement {
		times = (times instanceof Array) ? times : [];
		values = (values instanceof Array) ? values : [];

		const elementTypeName = 'Dme' + this.#getTypeName(type) + 'LogLayer';
		const dmeTypedLayer = DataModel.createElement(undefined, elementTypeName, name);

		dmeTypedLayer.createAttribute('times', DmAttributeType.TimeArray, times);
		dmeTypedLayer.createAttribute('curvetypes', DmAttributeType.IntArray, []);
		dmeTypedLayer.createAttribute('values', type + DmAttributeTypeFirstArray - 1, values);
		dmeTypedLayer.createAttribute('compressed', DmAttributeType.Void, null);

		return dmeTypedLayer;
	}

	#createDmeChannelsClip(name: string, timeFrame: DmElement, channels: DmElement[]): DmElement {
		const dmeChannelsClip = DataModel.createElement(undefined, 'DmeChannelsClip', name);

		dmeChannelsClip.createAttribute('timeFrame', DmAttributeType.Element, timeFrame);
		dmeChannelsClip.createAttribute('color', DmAttributeType.Color, vec4.fromValues(0, 0, 0, 0)/*'0 0 0 1'*/);//TODO
		dmeChannelsClip.createAttribute('text', DmAttributeType.String, '');//TODO
		dmeChannelsClip.createAttribute('mute', DmAttributeType.Bool, false);//TODO
		dmeChannelsClip.createAttribute('trackGroups', DmAttributeType.ElementArray, []);//TODO
		dmeChannelsClip.createAttribute('displayScale', DmAttributeType.Float, 1);//TODO

		//channels = (channels instanceof Array) ? channels : [];
		dmeChannelsClip.createAttribute('channels', DmAttributeType.ElementArray, channels);
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

	#createDmeTrackGroup(trackGroupName: string, tracks: DmElement[]): DmElement {
		const dmeTrackGroup = DataModel.createElement(undefined, 'DmeTrackGroup', trackGroupName);

		const trackList = Array.from(tracks);

		// Tracks
		dmeTrackGroup.createAttribute('tracks', DmAttributeType.ElementArray, trackList);
		dmeTrackGroup.createAttribute('visible', DmAttributeType.Bool, true);
		dmeTrackGroup.createAttribute('mute', DmAttributeType.Bool, false);
		dmeTrackGroup.createAttribute('displayScale', DmAttributeType.Float, 1);
		dmeTrackGroup.createAttribute('minimized', DmAttributeType.Bool, false);
		dmeTrackGroup.createAttribute('volume', DmAttributeType.Float, 1);
		dmeTrackGroup.createAttribute('forcemultitrack', DmAttributeType.Bool, false);

		return dmeTrackGroup;
	}

	#createDmeTimeFrame(name?: string, startTime = 0, duration = 60, offset = 0, scale = 1): DmElement {
		const dmeTimeFrame = DataModel.createElement(undefined, 'DmeTimeFrame');
		dmeTimeFrame.createAttribute('start', DmAttributeType.Time, startTime);
		dmeTimeFrame.createAttribute('duration', DmAttributeType.Time, duration);
		dmeTimeFrame.createAttribute('offset', DmAttributeType.Time, offset);
		dmeTimeFrame.createAttribute('scale', DmAttributeType.Float, scale);

		/*
				'name' 'string' 'unnamed'
			'start' 'time' '0.0000'
			'duration' 'time' '60.0000'
			'offset' 'time' '0.0000'
			'scale' 'float' '1'*/

		return dmeTimeFrame;
	}

	#createDmeTransformControl(name: string, valuePosition = vec3.create(), valueOrientation = quat.create(), positionChannel?: DmElement, orientationChannel?: DmElement): DmElement {
		const dmeTransformControl = DataModel.createElement(undefined, 'DmeTransformControl', name);

		dmeTransformControl.createAttribute('valuePosition', DmAttributeType.Vector3, valuePosition);//TODO
		dmeTransformControl.createAttribute('valueOrientation', DmAttributeType.Quaternion, valueOrientation);//TODO
		dmeTransformControl.createAttribute('positionChannel', DmAttributeType.Element, positionChannel);//TODO
		dmeTransformControl.createAttribute('orientationChannel', DmAttributeType.Element, orientationChannel);//TODO

		/*
		'valuePosition' 'vector3' '0 0 0'
		'valueOrientation' 'quaternion' '0.4999978542 0.4999978542 0.4999978542 0.5000064373'
		'positionChannel' 'element' '7d1da3e1-7094-494c-a231-902b36c2a850'
		'orientationChannel' 'element' 'b8bff802-607a-46dc-9995-9c151e068f06'
		*/

		return dmeTransformControl;
	}

	#createDmeScaleControl(name: string, valueScale: number, scaleChannel: DmElement): DmElement {
		const dmeTransformControl = DataModel.createElement(undefined, 'DmElement', name);

		dmeTransformControl.createAttribute('value', DmAttributeType.Float, valueScale);//TODO
		dmeTransformControl.createAttribute('channel', DmAttributeType.Element, scaleChannel);//TODO
		dmeTransformControl.createAttribute('defaultValue', DmAttributeType.Float, 0.1);//TODO

		return dmeTransformControl;
	}

	#createDmeAnimationSet(name: string, controls: DmElement[], rootControlGroup: DmElement/*, gameModel*/): DmElement {
		const dmeAnimationSet = DataModel.createElement(undefined, 'DmeAnimationSet', name);

		//controls = (controls instanceof Array) ? controls : [];
		dmeAnimationSet.createAttribute('controls', DmAttributeType.ElementArray, controls);
		dmeAnimationSet.createAttribute('presetGroups', DmAttributeType.ElementArray, null);
		dmeAnimationSet.createAttribute('phonememap', DmAttributeType.ElementArray, null);
		dmeAnimationSet.createAttribute('operators', DmAttributeType.ElementArray, null);
		dmeAnimationSet.createAttribute('rootControlGroup', DmAttributeType.Element, rootControlGroup);
		//dmeAnimationSet.createAttribute('gameModel', DmAttributeType.Element, gameModel);

		return dmeAnimationSet;
	}

	#createDmeGameModel(name: string, modelName: string, transform: DmElement | undefined, children: DmElement[] = [], skin = 0, bodyGroups: number, bones: DmElement[] = []): DmElement {
		//skin = typeof skin == 'number' ? skin : 0;
		//children = (children instanceof Array) ? children : [];
		//bones = (bones instanceof Array) ? bones : [];

		const dmeGameModel = DataModel.createElement(undefined, 'DmeGameModel', name);
		dmeGameModel.createAttribute('transform', DmAttributeType.Element, transform);
		dmeGameModel.createAttribute('shape', DmAttributeType.Element, null);
		dmeGameModel.createAttribute('visible', DmAttributeType.Bool, true);

		dmeGameModel.createAttribute('children', DmAttributeType.ElementArray, children);
		dmeGameModel.createAttribute('flexWeights', DmAttributeType.FloatArray, null);
		dmeGameModel.createAttribute('modelName', DmAttributeType.String, modelName);
		dmeGameModel.createAttribute('skin', DmAttributeType.Int, skin);
		dmeGameModel.createAttribute('body', DmAttributeType.Int, bodyGroups);
		dmeGameModel.createAttribute('sequence', DmAttributeType.Int, 0);
		dmeGameModel.createAttribute('flags', DmAttributeType.Int, 0);
		dmeGameModel.createAttribute('bones', DmAttributeType.ElementArray, bones);
		dmeGameModel.createAttribute('globalFlexControllers', DmAttributeType.ElementArray, null);
		dmeGameModel.createAttribute('computeBounds', DmAttributeType.Bool, true);
		dmeGameModel.createAttribute('evaluateProceduralBones', DmAttributeType.Bool, true);
		dmeGameModel.createAttribute('flexnames', DmAttributeType.StringArray, null);
		dmeGameModel.createAttribute('illumPositionDag', DmAttributeType.Element, null);
		dmeGameModel.createAttribute('localViewTargetFactor', DmAttributeType.Float, null);
		dmeGameModel.createAttribute('eyes_convergence', DmAttributeType.Float, null);

		return dmeGameModel;
	}

	createDmeGameParticleSystem(name: string, systemName: string, transform: DmElement): DmElement {
		const dmeGameParticleSystem = DataModel.createElement(undefined, 'DmeGameParticleSystem', name);
		dmeGameParticleSystem.createAttribute('transform', DmAttributeType.Element, transform);
		dmeGameParticleSystem.createAttribute('shape', DmAttributeType.Element, null);
		dmeGameParticleSystem.createAttribute('visible', DmAttributeType.Bool, true);

		dmeGameParticleSystem.createAttribute('children', DmAttributeType.ElementArray, []);
		dmeGameParticleSystem.createAttribute('particleSystemType', DmAttributeType.String, systemName);
		dmeGameParticleSystem.createAttribute('particleSystemDefinition', DmAttributeType.Element, null);
		dmeGameParticleSystem.createAttribute('simulating', DmAttributeType.Bool, true);
		dmeGameParticleSystem.createAttribute('emitting', DmAttributeType.Bool, true);
		dmeGameParticleSystem.createAttribute('randomSeed', DmAttributeType.Int, 1);
		dmeGameParticleSystem.createAttribute('simulationTimeScale', DmAttributeType.Float, 1);


		dmeGameParticleSystem.createAttribute('controlPoints', DmAttributeType.ElementArray, []);
		dmeGameParticleSystem.createAttribute('controlModels', DmAttributeType.ElementArray, []);
		return dmeGameParticleSystem;
	}

	createDmeMaterial(mtlName: string): DmElement {
		//colorTintBase = colorTintBase || vec4.fromValues(255, 255, 255, 255)/*'255 255 255 255'*/;

		// remove material path
		const name = mtlName.replace(/\//g, '\\').toLowerCase().replace(/^(.*)\\/, '');

		const dmeMaterial = DataModel.createElement(undefined, 'DmeMaterial', name);
		dmeMaterial.createAttribute('mtlName', DmAttributeType.String, mtlName);
		//dmeMaterial.createAttribute('$cloakfactor', DmAttributeType.Float, 0);
		//dmeMaterial.createAttribute('$cloakcolortint', DmAttributeType.Color, vec4.fromValues(255, 255, 255, 255)/*'255 255 255 255'*/);
		//dmeMaterial.createAttribute('$colortint_base', DmAttributeType.Color, colorTintBase);

		return dmeMaterial;
	}

	addGameModelMaterial(gameModel: DmElement, material: DmElement): void {
		if (gameModel) {
			const materials = gameModel.findAttribute('materials');
			if (materials) {
				materials.setValue((materials.getValue() as DmElement[]).push(material));//TODO
			} else {
				gameModel.createAttribute('materials', DmAttributeType.ElementArray, [material]);
			}
		}
	}

	#createDmeControlGroup(name?: string, children: DmElement[] = [], controls: DmElement[] = []): DmElement {
		//children = (children instanceof Array) ? children : [];
		//controls = (controls instanceof Array) ? controls : [];
		const dmeControlGroup = DataModel.createElement(undefined, 'DmeControlGroup', name);
		dmeControlGroup.createAttribute('children', DmAttributeType.ElementArray, children);
		dmeControlGroup.createAttribute('controls', DmAttributeType.ElementArray, controls);


		dmeControlGroup.createAttribute('groupColor', DmAttributeType.Color, vec4.fromValues(0, 128, 255, 255)/*'0 128 255 255'*/);
		dmeControlGroup.createAttribute('controlColor', DmAttributeType.Color, vec4.fromValues(200, 200, 200, 255)/*'200 200 200 255'*/);
		dmeControlGroup.createAttribute('visible', DmAttributeType.Bool, true);
		dmeControlGroup.createAttribute('selectable', DmAttributeType.Bool, true);
		dmeControlGroup.createAttribute('snappable', DmAttributeType.Bool, true);

		return dmeControlGroup;
	}

	createAnimSetForModel(name: string, modelPath: string, dynamicProp: Source1ModelInstance, position: vec3, quaternion: quat, parentGameModel: DmElement | undefined, viewTargetPos?: vec3): DmElement | null {
		modelPath = modelPath.replace(/\.mdl$/, '') + '.mdl';
		const sourceModel = dynamicProp.sourceModel;
		if (!(sourceModel instanceof SourceModel)) {
			return null;
		}

		const gameModel = this.#createDmeGameModel(name, modelPath, undefined, undefined, Number(dynamicProp.skin), sourceModel.getBodyNumber(dynamicProp.getBodyGroups()));

		const gameModelRootControlGroup = this.#createDmeControlGroup();
		const animSet = this.#createDmeAnimationSet(name, [], gameModelRootControlGroup);

		animSet.createAttribute('gameModel', DmAttributeType.Element, gameModel);
		const channelsClip = this.#createDmeChannelsClip(name, this.#createDmeTimeFrame(), []);
		const pyro1 = this.createDmeDag(name, this.#createDmeTransform(), [gameModel]);
		pyro1.setAttributeValue('visible', dynamicProp.isVisible());

		const animSetControls = animSet.findAttribute('controls');

		this.#pushAnimSet(animSet);
		this.#pushChannelsClip(channelsClip);
		this.#pushDagToScene(pyro1);

		this.#createGameModelFlexes(gameModel, animSet, sourceModel, channelsClip, animSetControls);

		const rootTransform = this.#createBoneTransform(animSet, 'rootTransform', 'rootTransform', position, quaternion, channelsClip.findAttribute('channels'), animSetControls);
		this.createDmeDag('rootTransform', rootTransform, []);
		//gameModel.findAttribute('children').pushValue(rootTransformDag);

		gameModel.findAttribute('transform')?.setValue(rootTransform);

		this.#createGameModelBones(gameModel, animSet, dynamicProp, parentGameModel, channelsClip, animSetControls);

		{
			const viewTargetTransform = this.#createBoneTransform(animSet, 'viewTarget', 'viewTarget', viewTargetPos/*[0, -600, -192]*/, quat.create(), channelsClip.findAttribute('channels'), animSetControls);
			const viewTargetDag = this.createDmeDag('viewTarget', viewTargetTransform, []);
			gameModel.findAttribute('children')?.pushValue(viewTargetDag);
			gameModel.createAttribute('viewTargetDag', DmAttributeType.Element, viewTargetDag);
		}

		if (parentGameModel) {
			this.makeChild(gameModel, parentGameModel)
		}
		return gameModel;
	}

	#getGameModelControlGroup(gameModel: DmElement, controlName: string): DmElement | null {
		const defaultControlGroupName = 'Unknown';
		const defaultAnimationGroups = SfmSession.defaultAnimationGroups;


		const controlsGroupName = this.#getGameModelControlGroup2(defaultAnimationGroups?.groupFile as JSONObject, controlName) ?? defaultControlGroupName;
		const controlsGroupArray = controlsGroupName.split('.');

		const currentControlGroup = gameModel.findAttribute('rootControlGroup')?.getValue() as DmElement;
		if (!currentControlGroup) {
			return null;
		}
		const controlGroup = this.#getControlGroup(currentControlGroup, controlsGroupArray);

		return controlGroup;
	}

	#getControlGroup(dmeControlGroup: DmElement, controlName: string[]): DmElement {
		const currentControlName = controlName[0];
		if (currentControlName == '') {
			return this.#getControlGroup(dmeControlGroup, controlName.slice(1));
		}

		const childrenArray = dmeControlGroup.findAttribute('children')?.getValue() as DmElement[];
		if (childrenArray) {
			for (const child of childrenArray) {
				//const child = childrenArray[i]!;
				if (child.findAttribute('name')?.getValue() == currentControlName) {
					if (controlName.length == 1) {
						// No more level
						return child;
					}
					return this.#getControlGroup(child, controlName.slice(1));
				}
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
					for (const s of sub) {
						if (s as string == controlName) {
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

	getDefaultAnimationGroups(): JSONObject {
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

	createAnimSetForCamera(name: string, camera: DmElement): DmElement {
		const animSetControlArray: DmElement[] = [];
		const channelArray: DmElement[] = [];

		const controlGroup = this.#createDmeControlGroup('all', undefined, animSetControlArray);
		const rootControlGroup = this.#createDmeControlGroup(undefined, [controlGroup]);
		const animSet = this.#createDmeAnimationSet(name, animSetControlArray, rootControlGroup/*, camera*/);
		animSet.createAttribute('camera', DmAttributeType.Element, camera);

		const channelsClip = this.#createDmeChannelsClip(name, this.#createDmeTimeFrame(name, -5, 70), channelArray);

		for (const cameraChannel of cameraChannels) {
			//const cameraChannel = cameraChannels[i]!;

			const scaleOperator = this.createRescaleOperator(cameraChannel.name + '_rescale', cameraChannel.result, cameraChannel.lo, cameraChannel.hi);

			const source = DataModel.createElement(undefined, 'DmElement', cameraChannel.name);

			const channel = this.#createDmeChannel(cameraChannel.name, source, 'value', 0, scaleOperator, 'value', 0, 1);
			source.createAttribute('channel', DmAttributeType.Element, channel);

			const value = (cameraChannel.result - cameraChannel.lo) / (cameraChannel.hi - cameraChannel.lo);
			const defaultValue = cameraChannel.defaultValue;
			source.createAttribute('value', DmAttributeType.Float, value);//TODO
			source.createAttribute('defaultValue', DmAttributeType.Float, defaultValue);//TODO

			const scaleChannel = this.#createDmeChannel('scaled_' + cameraChannel.name + '_channel', scaleOperator, 'result', 0, camera, cameraChannel.name, 0, 1);

			const scaleChannelLog = this.#createDmeTypedLog(DmAttributeType.Float, 'float log', [], []);
			scaleChannel.createAttribute('log', DmAttributeType.Element, scaleChannelLog);

			//animSet.findAttribute('controls').pushValue(source);
			animSetControlArray.push(source);
			animSet.findAttribute('operators')?.pushValue(scaleOperator);
			channelsClip.findAttribute('channels')?.pushValue(channel);
			channelsClip.findAttribute('channels')?.pushValue(scaleChannel);
		}


		/****************/
		const cameraTransformControl = this.#createDmeTransformControl('transform');
		const systemTransform = camera.findAttribute('transform')?.value as DmElement;

		const transformPosChannel = this.#createDmeChannel('transform_pos', cameraTransformControl, 'valuePosition', 0, systemTransform, 'position', 0, 3);
		const transformRotChannel = this.#createDmeChannel('transform_rot', cameraTransformControl, 'valueOrientation', 0, systemTransform, 'orientation', 0, 3);

		const transformPosChannelLog = this.#createDmeTypedLog(DmAttributeType.Vector3, 'vector3 log', [0], [systemTransform.findAttribute('position')!.value]);
		transformPosChannel.createAttribute('log', DmAttributeType.Element, transformPosChannelLog);

		const transformRotChannelLog = this.#createDmeTypedLog(DmAttributeType.Quaternion, 'quaternion log', [0], [systemTransform.findAttribute('orientation')!.value]);
		transformRotChannel.createAttribute('log', DmAttributeType.Element, transformRotChannelLog);

		cameraTransformControl.createAttribute('positionChannel', DmAttributeType.Element, transformPosChannel);
		cameraTransformControl.createAttribute('orientationChannel', DmAttributeType.Element, transformRotChannel);

		animSetControlArray.push(cameraTransformControl);
		channelsClip.findAttribute('channels')?.pushValue(transformPosChannel);
		channelsClip.findAttribute('channels')?.pushValue(transformRotChannel);
		/****************/

		this.#pushChannelsClip(channelsClip);
		this.#pushAnimSet(animSet);
		return animSet;
	}

	#createExpressionOperator(name: string, result: number, expr: string, spewresult: boolean): DmElement {
		const dmeExpressionOperator = DataModel.createElement(undefined, 'DmeExpressionOperator', name);
		dmeExpressionOperator.createAttribute('result', DmAttributeType.Float, result);
		dmeExpressionOperator.createAttribute('expr', DmAttributeType.String, expr);
		dmeExpressionOperator.createAttribute('spewresult', DmAttributeType.Bool, spewresult);

		return dmeExpressionOperator;
	}


	createRescaleOperator(name: string, result: number, lo: number, hi: number): DmElement {
		const rescaleOperator = this.#createExpressionOperator(name + '_rescale', result, 'lerp(value, lo, hi)', false)

		const value = (result - lo) / (hi - lo);

		rescaleOperator.createAttribute('value', DmAttributeType.Float, value);
		rescaleOperator.createAttribute('lo', DmAttributeType.Float, lo);
		rescaleOperator.createAttribute('hi', DmAttributeType.Float, hi);

		return rescaleOperator;
	}

	#pushAnimSet(animSet: DmElement): void {
		const animationSets = this.filmShot1?.findAttribute('animationSets');
		if (animationSets) {
			(animationSets.getValue() as DmElement[])?.push(animSet);
		} else {
			console.error('Attribute animationSets not found');
		}
	}


	#pushChannelsClip(channelsClip: DmElement): void {
		const children = this.animSetEditorChannels?.findAttribute('children');
		if (children) {
			(children.getValue() as DmElement[])?.unshift(channelsClip);//TODO: push end
		} else {
			console.error('Attribute children not found');
		}
	}

	#pushDagToScene(dag: DmElement): void {
		const children = this.scene?.findAttribute('children');
		if (children) {
			(children.getValue() as DmElement[])?.push(dag);
		} else {
			console.error('Attribute children not found');
		}
	}

	createAnimSetForParticleSystem(name: string, _: undefined, systemName: string, parentGameModel: DmElement, boneName: string, controlPoints: ControlPoint[]): DmElement {
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

			const controlPointXPosChannelLog = this.#createDmeTypedLog(DmAttributeType.Vector3, 'vector3 log', [], []);
			controlPointXPosChannel.createAttribute('log', DmAttributeType.Element, controlPointXPosChannelLog);

			const controlPointXRotChannelLog = this.#createDmeTypedLog(DmAttributeType.Quaternion, 'quaternion log', [], []);
			controlPointXRotChannel.createAttribute('log', DmAttributeType.Element, controlPointXRotChannelLog);

			transformControlX.createAttribute('positionChannel', DmAttributeType.Element, controlPointXPosChannel);
			transformControlX.createAttribute('orientationChannel', DmAttributeType.Element, controlPointXRotChannel);
			const dmeDagControlPointX = this.createDmeDag(cpName, transformX, undefined);

			controlPointsArray.push(transformX);
			controlPointsDagArray.push(dmeDagControlPointX);
			transfomControlArray.push(transformControlX);
			channelArray.push(controlPointXPosChannel, controlPointXRotChannel);

			const controlPoint = controlPoints[i];
			//if (i && controlPoint && controlPoint.currentPosition) {
			//controlPointXPosChannelLog.createAttribute('defaultValue', DmAttributeType.Vector3, controlPoint.currentPosition);
			//controlPointXPosChannelLog.findAttribute('defaultvalue').setValue(controlPoint.currentPosition);
			//controlPointXPosChannelLog.findAttribute('usedefaultvalue').setValue(true);
			//}
			if (controlPoint) {
				/*
				var head = this.#findBone(parentGameModel, controlPoint.attachmentName);
				if (head) {
					dmeDagControlPointX.createAttribute('overrideParent', DmAttributeType.Element, head);
					dmeDagControlPointX.createAttribute('overridePos', DmAttributeType.Bool, true);
					dmeDagControlPointX.createAttribute('overrideRot', DmAttributeType.Bool, true);
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

		const transformPosChannelLog = this.#createDmeTypedLog(DmAttributeType.Vector3, 'vector3 log', [], []);
		transformPosChannel.createAttribute('log', DmAttributeType.Element, transformPosChannelLog);

		const transformRotChannelLog = this.#createDmeTypedLog(DmAttributeType.Quaternion, 'quaternion log', [], []);
		transformRotChannel.createAttribute('log', DmAttributeType.Element, transformRotChannelLog);

		control1.createAttribute('positionChannel', DmAttributeType.Element, transformPosChannel);
		control1.createAttribute('orientationChannel', DmAttributeType.Element, transformRotChannel);
		/****************/

		const emittingLog = this.#createDmeTypedLog(DmAttributeType.Bool, 'bool log', [0, 1.0, 65.0, 65.0001], [0, 1, 1, 0]);
		const visibleLog = this.#createDmeTypedLog(DmAttributeType.Bool, 'bool log', [0, 1.0, 65.0, 65.0001], [0, 1, 1, 0]);
		const similatingLog = this.#createDmeTypedLog(DmAttributeType.Bool, 'bool log', [0, 1.0, 65.0, 65.0001], [0, 1, 1, 0]);

		emittingChannel.createAttribute('log', DmAttributeType.Element, emittingLog);
		visibleChannel.createAttribute('log', DmAttributeType.Element, visibleLog);
		simulatingChannel.createAttribute('log', DmAttributeType.Element, similatingLog);


		const channelsClip = this.#createDmeChannelsClip(name, this.#createDmeTimeFrame(name, -5, 70),
			[emittingChannel, visibleChannel, simulatingChannel, transformPosChannel, transformRotChannel].concat(channelArray)
		);
		/*****************/

		let head = this.#findBone(parentGameModel, boneName);//.findAttribute('transform');
		console.error(head);
		if (!head) {
			head = parentGameModel;
		}

		gameModel.createAttribute('children', DmAttributeType.ElementArray, controlPointsDagArray/*[dmeDagControlPoint0, dmeDagControlPoint9]*/);
		gameModel.createAttribute('controlPoints', DmAttributeType.ElementArray, controlPointsArray/*[transformControlPoint0, transformControlPoint9]*/);

		const cp0 = controlPointsDagArray[0];
		if (cp0) {
			cp0.createAttribute('overrideParent', DmAttributeType.Element, head);
			cp0.createAttribute('overridePos', DmAttributeType.Bool, true);
			cp0.createAttribute('overrideRot', DmAttributeType.Bool, true);
		}

		const pyro1 = this.createDmeDag(name, this.#createDmeTransform(), [gameModel]);
		/************/

		this.#pushAnimSet(animSet);
		this.#pushChannelsClip(channelsClip);
		this.#pushDagToScene(pyro1);

		animSet.createAttribute('particle system', DmAttributeType.Element, gameModel);
		//animSet.createAttribute('particleFiles', DmAttributeType.StringArray, [fileName]);

		return gameModel;
	}

	makeChild(gameModel: DmElement, parentGameModel: DmElement): void {
		gameModel.createAttribute('overrideParent', DmAttributeType.Element, parentGameModel);
		gameModel.createAttribute('overridePos', DmAttributeType.Bool, true);
		gameModel.createAttribute('overrideRot', DmAttributeType.Bool, true);

		const childArray: DmElement[] = gameModel.findAttribute('children')?.getValue() as DmElement[];
		for (const child of childArray) {
			this.#linkBoneChild(child, parentGameModel);
		}
	}

	#getBoneName(element: DmElement): string {
		const elementName = element.findAttribute('name')?.getValue() as string;

		const result = /^bone \d* \((.*)\)$/.exec(elementName);
		if (result && result[1]) {
			return result[1];
		}

		return elementName;
	}

	#linkBoneChild(bone: DmElement, parentGameModel: DmElement): void {
		const boneName = this.#getBoneName(bone);
		const parentBone = this.#findBone(parentGameModel, boneName);
		if (parentBone) {
			bone.createAttribute('overrideParent', DmAttributeType.Element, parentBone);
			bone.createAttribute('overridePos', DmAttributeType.Bool, true);
			bone.createAttribute('overrideRot', DmAttributeType.Bool, true);

			const transform = bone.findAttribute('transform')?.getValue() as DmElement;
			vec3.zero(transform.findAttribute('position')!.getValue() as vec3);
			vec4.zero(transform.findAttribute('orientation')!.getValue() as vec3);
		}

		const children = bone.findAttribute('children');
		if (children) {
			const childArray = children.getValue() as DmElement[];
			if (childArray) {
				for (const child of childArray) {
					//const child = childArray[i]!;
					this.#linkBoneChild(child, parentGameModel);

				}
			}
		}
	}

	#findBone(gameModel: DmElement, boneName: string): DmElement | null {
		const children = gameModel.findAttribute('children');
		if (children) {
			const childArray: DmElement[] = children.getValue() as DmElement[];
			if (childArray) {
				for (const child of childArray) {
					//const child = childArray[i];
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

	#createGameModelBones(gameModel: DmElement, animSet: DmElement, dynamicProp: Source1ModelInstance, parentGameModel: DmElement | undefined, channelsClip: DmElement, animSetControls?: DmAttribute | null): void {
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

					let bonePos: vec4, boneQuat: quat;

					if (bone.parent instanceof Skeleton) {
						bonePos = bone.worldPos;
						boneQuat = bone.worldQuat;
					} else {
						bonePos = bone.getPosition();//vec3.sub(vec3.create(), bone.worldPos, bone.parent.worldPos)//bone.position;
						boneQuat = bone.getQuaternion();
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
							(children.getValue() as DmElement[])?.push(boneDmeDag);
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
					const attachmentParentBone = dynamicProp.getBoneByName(attachmentBone?.name ?? '');

					//transformArray.push(boneTransform);

					/*if (-1 == bone.parentBone) {
						elementArray.push(boneDmeDag);
					} else {*/
					//var children// = boneTmp[boneTmp2[bone.bone.name]].findAttribute('children');TODOv2
					if (attachmentParentBone) {
						const children = boneTmp.get(attachmentParentBone)?.findAttribute('children');
						if (children) {
							(children.getValue() as DmElement[]).push(boneDmeDag);
						}
					}
					//}
				}
			}
		}

		//return transformArray;
		const bones = gameModel.findAttribute('bones');
		if (bones) {
			bones.setValue((bones.getValue() as DmElement[]).concat(transformArray));//TODO
		}
		const children = gameModel.findAttribute('children');
		if (children) {
			children.setValue((children.getValue() as DmElement[]).concat(elementArray));//TODO
		}

		gameModel.createAttribute('illumPositionDag', DmAttributeType.Element, illumPositionDag);
	}

	#createBoneTransform(gameModel: DmElement, boneName1: string, boneName2: string, bonePos: vec3 | undefined, boneQuat: quat, channelsClip?: DmAttribute | null, animSetControls?: DmAttribute | null, boneScale?: number): DmElement {//TODO
		const boneTransform = this.#createDmeTransform(boneName1, bonePos, boneQuat, boneScale);
		const boneTransformControl = this.#createDmeTransformControl(boneName2);

		const bonePosChannel = this.#createDmeChannel(boneName2 + '_p', boneTransformControl, 'valuePosition', 0, boneTransform, 'position', 0, 3);
		const boneRotChannel = this.#createDmeChannel(boneName2 + '_o', boneTransformControl, 'valueOrientation', 0, boneTransform, 'orientation', 0, 3);
		if (boneScale !== undefined) {
			const boneScaleChannel = this.#createDmeChannel(boneName2 + '_scale', boneTransformControl, 'value', 0, boneTransform, 'value', 0, 3);
			boneTransformControl.createAttribute('scaleChannel', DmAttributeType.Element, boneScaleChannel);
			(channelsClip?.getValue() as DmElement[])?.push(boneScaleChannel);
			const boneTransformControlScale = this.#createDmeScaleControl(boneName2 + '_scale', 1, boneScaleChannel);

			const transformScaleChannelLog = this.#createDmeTypedLog(DmAttributeType.Float, 'float log', [0], [1]);
			boneScaleChannel.createAttribute('log', DmAttributeType.Element, transformScaleChannelLog);

			//const cameraChannel = boneScaleChannel;
			const minScale = 0;
			const maxScale = 10;
			const resultScale = boneScale;

			const scaleOperator = this.createRescaleOperator(boneName2 + '_scale', resultScale, minScale, maxScale);

			const source = DataModel.createElement(undefined, 'DmElement', boneName2 + '_scale');

			const channel = this.#createDmeChannel(boneName2, source, 'value', 0, scaleOperator, 'value', 0, 1);
			source.createAttribute('channel', DmAttributeType.Element, channel);

			const value = (resultScale - minScale) / (maxScale - minScale);
			const defaultValue = 0.1;
			source.createAttribute('value', DmAttributeType.Float, value);//TODO
			source.createAttribute('defaultValue', DmAttributeType.Float, defaultValue);//TODO

			const scaleChannel = this.#createDmeChannel('scaled_' + boneName2 + '_scale_channel', scaleOperator, 'result', 0, boneTransform, 'scale', 0, 1);

			const scaleChannelLog = this.#createDmeTypedLog(DmAttributeType.Float, 'float log', [], []);
			scaleChannel.createAttribute('log', DmAttributeType.Element, scaleChannelLog);

			//animSet.findAttribute('controls').pushValue(source);
			//animSetControlArray.push(source);
			(animSetControls?.getValue() as DmElement[])?.push(source);
			gameModel.findAttribute('operators')?.pushValue(scaleOperator);
			(channelsClip?.getValue() as DmElement[])?.push(channel);
			(channelsClip?.getValue() as DmElement[])?.push(scaleChannel);

			const controlGroup = this.#getGameModelControlGroup(gameModel, boneName2);//TODO

			controlGroup?.findAttribute('controls')?.pushValue(boneTransformControlScale);

		}

		boneTransformControl.createAttribute('positionChannel', DmAttributeType.Element, bonePosChannel);
		boneTransformControl.createAttribute('orientationChannel', DmAttributeType.Element, boneRotChannel);

		(channelsClip?.getValue() as DmElement[])?.push(bonePosChannel);
		(channelsClip?.getValue() as DmElement[])?.push(boneRotChannel);

		(animSetControls?.getValue() as DmElement[])?.push(boneTransformControl);


		const transformPosChannelLog = this.#createDmeTypedLog(DmAttributeType.Vector3, 'vector3 log', [0], [bonePos]);
		bonePosChannel.createAttribute('log', DmAttributeType.Element, transformPosChannelLog);

		const transformRotChannelLog = this.#createDmeTypedLog(DmAttributeType.Quaternion, 'quaternion log', [0], [boneQuat]);
		boneRotChannel.createAttribute('log', DmAttributeType.Element, transformRotChannelLog);

		const controlGroup = this.#getGameModelControlGroup(gameModel, boneName2);//TODO

		controlGroup?.findAttribute('controls')?.pushValue(boneTransformControl);

		return boneTransform;
	}

	#createGameModelFlexes(gameModel: DmElement, animSet: DmElement, sourceModel: SourceModel, channelsClip: DmElement, pyroGameModelBodyControlGroup: DmAttribute | null): void {
		//console.error(sourceModel);
		const flexControllersArray = sourceModel.mdl.getFlexControllers() || [];
		const flexControllersArrayLength = flexControllersArray.length;
		for (let flexControllersIndex = 0; flexControllersIndex < flexControllersArrayLength; ++flexControllersIndex) {
			const flexController = flexControllersArray[flexControllersIndex];
			if (flexController) {
				//console.error(flexController);
				const flexName = flexController.name;
				//const flexType = flexController.type;

				//var flexWeight = flexType == 'eyes' ? 0.5 : 0.0;
				const flexWeight = flexController.min < 0 ? 0.5 : 0.0;//TODO: get the stereo flag from controllerui
				//var flexWeight = flexController.min < 0 ? 0.5 : SourceEngine.Models.GlobalFlexController.getControllerValue(flexName);//TODO: get the stereo flag from controllerui

				const dmeGlobalFlexControllerOperator = this.createDmeGlobalFlexControllerOperator(flexName, flexWeight, gameModel);

				const flexElement = DataModel.createElement(undefined, 'DmElement', flexName);
				flexElement.createAttribute('defaultValue', DmAttributeType.Float, flexWeight);
				flexElement.createAttribute('value', DmAttributeType.Float, flexWeight);
				const flexChannel = this.#createDmeChannel(flexName + '_flex_channel', flexElement, 'value', 0, dmeGlobalFlexControllerOperator, 'flexWeight', 0, 3);
				flexElement.createAttribute('channel', DmAttributeType.Element, flexChannel);


				const flexChannelLog = this.#createDmeTypedLog(DmAttributeType.Float, 'float log');
				flexChannel.createAttribute('log', DmAttributeType.Element, flexChannelLog);

				gameModel.findAttribute('flexWeights')?.pushValue(flexWeight);
				gameModel.findAttribute('flexnames')?.pushValue(flexName);
				gameModel.findAttribute('globalFlexControllers')?.pushValue(dmeGlobalFlexControllerOperator);
				channelsClip?.findAttribute('channels')?.pushValue(flexChannel);
				(pyroGameModelBodyControlGroup?.getValue() as DmElement[] | undefined)?.push(flexElement);

				const controlGroup = this.#getGameModelControlGroup(animSet, flexName);//TODO

				controlGroup?.findAttribute('controls')?.pushValue(flexElement);

			}
		}
		return;
	}


	createDmeTextFXClip(name: string, text: string, textColor = vec4.fromValues(255, 255, 255, 255), fontName: string): DmElement {
		//textColor = textColor || vec4.fromValues(255, 255, 255, 255);

		const dmeTextFXClip = DataModel.createElement(undefined, 'DmeTextFXClip', name);

		dmeTextFXClip.createAttribute('timeFrame', DmAttributeType.Element, this.#createDmeTimeFrame());
		dmeTextFXClip.createAttribute('color', DmAttributeType.Color, vec4.fromValues(0, 0, 0, 0));
		dmeTextFXClip.createAttribute('text', DmAttributeType.String, text);
		dmeTextFXClip.createAttribute('mute', DmAttributeType.Bool, false);
		dmeTextFXClip.createAttribute('trackGroups', DmAttributeType.ElementArray, null);
		dmeTextFXClip.createAttribute('displayScale', DmAttributeType.Float, 1);

		dmeTextFXClip.createAttribute('horizontalAlignment', DmAttributeType.Int, -1);
		dmeTextFXClip.createAttribute('verticalAlignment', DmAttributeType.Int, 1);
		dmeTextFXClip.createAttribute('xOffset', DmAttributeType.Int, 0);
		dmeTextFXClip.createAttribute('yOffset', DmAttributeType.Int, 0);
		dmeTextFXClip.createAttribute('xSpeed', DmAttributeType.Int, 0);
		dmeTextFXClip.createAttribute('ySpeed', DmAttributeType.Int, 0);
		dmeTextFXClip.createAttribute('textColor', DmAttributeType.Color, textColor);
		dmeTextFXClip.createAttribute('font', DmAttributeType.String, fontName);

		return dmeTextFXClip;
	};

	DmeMaterialOverlayFXClip(name: string, overlayColor = vec4.fromValues(255, 255, 255, 255), materialName: string): DmElement {
		//overlayColor = overlayColor || vec4.fromValues(255, 255, 255, 255);

		const dmeMaterialOverlayFXClip = DataModel.createElement(undefined, 'DmeMaterialOverlayFXClip', name);

		dmeMaterialOverlayFXClip.createAttribute('timeFrame', DmAttributeType.Element, this.#createDmeTimeFrame());
		dmeMaterialOverlayFXClip.createAttribute('color', DmAttributeType.Color, vec4.fromValues(0, 0, 0, 0));
		dmeMaterialOverlayFXClip.createAttribute('text', DmAttributeType.String, null);
		dmeMaterialOverlayFXClip.createAttribute('mute', DmAttributeType.Bool, false);
		dmeMaterialOverlayFXClip.createAttribute('trackGroups', DmAttributeType.ElementArray, null);
		dmeMaterialOverlayFXClip.createAttribute('displayScale', DmAttributeType.Float, 1);
		dmeMaterialOverlayFXClip.createAttribute('material', DmAttributeType.String, materialName);
		dmeMaterialOverlayFXClip.createAttribute('overlaycolor', DmAttributeType.Color, overlayColor);

		dmeMaterialOverlayFXClip.createAttribute('left', DmAttributeType.Int, 0);
		dmeMaterialOverlayFXClip.createAttribute('top', DmAttributeType.Int, 0);
		dmeMaterialOverlayFXClip.createAttribute('width', DmAttributeType.Int, 1);
		dmeMaterialOverlayFXClip.createAttribute('height', DmAttributeType.Int, 1);
		dmeMaterialOverlayFXClip.createAttribute('fullscreen', DmAttributeType.Bool, 1);
		dmeMaterialOverlayFXClip.createAttribute('useSubRect', DmAttributeType.Bool, 0);
		dmeMaterialOverlayFXClip.createAttribute('movementAngle', DmAttributeType.Float, 0);
		dmeMaterialOverlayFXClip.createAttribute('movementSpeed', DmAttributeType.Float, 0);
		dmeMaterialOverlayFXClip.createAttribute('subRectLeft', DmAttributeType.Int, 0);
		dmeMaterialOverlayFXClip.createAttribute('subRectTop', DmAttributeType.Int, 0);
		dmeMaterialOverlayFXClip.createAttribute('subRectWidth', DmAttributeType.Int, 0);
		dmeMaterialOverlayFXClip.createAttribute('subRectHeight', DmAttributeType.Int, 0);

		return dmeMaterialOverlayFXClip;
	};

	addLight(lightName: string, cameraPos: vec3, cameraOrientation: quat/*lookAt*/): [DmElement | null, DmElement | null] {
		this.#createDmeProjectedLight(lightName);

		//const gameModelRootControlGroup = this.#createDmeControlGroup();

		const result = this.#createAnimSetFromTemplate('DmeProjectedLight', lightName);
		const animSet = result[0];
		const light = result[1];
		animSet?.createAttribute('light', DmAttributeType.Element, light);

		//cameraOrientation = LookAt(cameraPos, lookAt, [0, 0, 1]);
		const lightTransform = this.#createDmeTransform(undefined, cameraPos, cameraOrientation);
		light?.findAttribute('transform')?.setValue(lightTransform);

		this.lightsDag = this.lightsDag ?? ((): DmElement => { const a = this.createDmeDag('Lights', this.#createDmeTransform(), []); this.#pushDagToScene(a); return a; })();

		this.lightsDag.findAttribute('children')?.pushValue(light);


		return result;
	}


	#createDmeProjectedLight(lightName: string/*, lightOptions*/): DmElement | null {
		//lightOptions = lightOptions || {};


		return this.#createElementFromTemplate('DmeProjectedLight', lightName);
		/*



			var dmeProjectedLight = DataModel.createElementNew('DmeProjectedLight');
			dmeGameModel.createAttribute('transform', DmAttributeType.Element, transform);
			dmeGameModel.createAttribute('shape', DmAttributeType.Element, null);
			dmeGameModel.createAttribute('visible', DmAttributeType.Bool, true);

			dmeGameModel.createAttribute('children', DmAttributeType.ElementArray, lightOptions.children);
			dmeGameModel.createAttribute('color', DmAttributeType.ElementArray, lightOptions.children);





			dmeGameModel.createAttribute('flexWeights', DmAttributeType.FloatArray, null);
			dmeGameModel.createAttribute('modelName', DmAttributeType.String, modelName);
			dmeGameModel.createAttribute('skin', DmAttributeType.Int, skin);
			dmeGameModel.createAttribute('body', DmAttributeType.Int, bodyGroups);
			dmeGameModel.createAttribute('sequence', DmAttributeType.Int, 0);
			dmeGameModel.createAttribute('flags', DmAttributeType.Int, 0);
			dmeGameModel.createAttribute('bones', DmAttributeType.ElementArray, bones);
			dmeGameModel.createAttribute('globalFlexControllers', DmAttributeType.ElementArray, null);
			dmeGameModel.createAttribute('computeBounds', DmAttributeType.Bool, true);
			dmeGameModel.createAttribute('evaluateProceduralBones', DmAttributeType.Bool, true);
			dmeGameModel.createAttribute('flexnames', DmAttributeType.StringArray, null);
			dmeGameModel.createAttribute('illumPositionDag', DmAttributeType.Element, null);
			dmeGameModel.createAttribute('localViewTargetFactor', DmAttributeType.Float, null);
			dmeGameModel.createAttribute('eyes_convergence', DmAttributeType.Float, null);

			return dmeGameModel;
		**/
	}

	#createAnimSetFromTemplate(elementType: string, elementName: string): [DmElement | null, DmElement | null] {
		const animSet = this.#createElementFromTemplate('DmeAnimationSet', elementName);
		const element = this.#createElementFromTemplate(elementType, elementName);

		const animSetControlArray = [];
		const channelArray: DmElement[] = [];

		const channelsClip = this.#createDmeChannelsClip(elementName, this.#createDmeTimeFrame(elementName, -5, 70), channelArray);

		const templates = elementTemplates[elementType];
		//const that = this;
		if (templates) {
			const templatesArray = Object.keys(templates);
			for (const attribName of templatesArray) {
				//Object.keys(templates).forEach(function (key) {
				//const attribName = templatesArray[templateIndex]!;
				const value = templates[attribName];

				const attribType = value[0];
				//const attribValue = value[1];
				const attribChannel = value[2];

				if (attribChannel) {
					const channelRescale = attribChannel.rescale;

					if (attribName == 'transform') {
						const cameraTransformControl = this.#createDmeTransformControl('transform');
						const systemTransform = element?.findAttribute('transform')?.value as DmElement | undefined;

						if (systemTransform) {
							const transformPosChannel = this.#createDmeChannel('transform_pos', cameraTransformControl, 'valuePosition', 0, systemTransform, 'position', 0, 3);
							const transformRotChannel = this.#createDmeChannel('transform_rot', cameraTransformControl, 'valueOrientation', 0, systemTransform, 'orientation', 0, 3);

							const transformPosChannelLog = this.#createDmeTypedLog(DmAttributeType.Vector3, 'vector3 log', [0], [systemTransform?.findAttribute('position')?.value]);
							transformPosChannel.createAttribute('log', DmAttributeType.Element, transformPosChannelLog);

							const transformRotChannelLog = this.#createDmeTypedLog(DmAttributeType.Quaternion, 'quaternion log', [0], [systemTransform?.findAttribute('orientation')?.value]);
							transformRotChannel.createAttribute('log', DmAttributeType.Element, transformRotChannelLog);

							cameraTransformControl.createAttribute('positionChannel', DmAttributeType.Element, transformPosChannel);
							cameraTransformControl.createAttribute('orientationChannel', DmAttributeType.Element, transformRotChannel);

							animSetControlArray.push(cameraTransformControl);
							channelsClip.findAttribute('channels')?.pushValue(transformPosChannel);
							channelsClip.findAttribute('channels')?.pushValue(transformRotChannel);
						}
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
							sourceDmeElement.createAttribute('channel', DmAttributeType.Element, dmeChannel);
							sourceDmeElement.createAttribute('value', DmAttributeType.Float, attribChannel.value);//TODO
							sourceDmeElement.createAttribute('defaultValue', DmAttributeType.Float, attribChannel.value/*defaultValue*/);//TODO


							animSetControlArray.push(sourceDmeElement);
						}
						//animSet.findAttribute('operators').pushValue(scaleOperator);
						//channelsClip.findAttribute('channels')?.pushValue(dmeChannel);
						//channelsClip.findAttribute('channels').pushValue(scaleChannel);
					}





				}
				/*if (attribType == DmAttributeType.Element) {
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
		//animSet.createAttribute('camera', DmAttributeType.Element, camera);

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
			sourceDmeElement.createAttribute('channel', DmAttributeType.Element, dmeChannel);

			var value = (chanel.result - chanel.lo) / (chanel.hi - chanel.lo);
			var defaultValue = chanel.defaultValue;
			sourceDmeElement.createAttribute('value', DmAttributeType.Float, value);//TODO
			sourceDmeElement.createAttribute('defaultValue', DmAttributeType.Float, defaultValue);//TODO

			var scaleChannel = this.#createDmeChannel('scaled_' + chanel.name + '_channel', scaleOperator, 'result', 0, camera, chanel.name, 0, 1);

			var scaleChannelLog = this.#createDmeTypedLog(DmAttributeType.Float, 'float log', [], []);
			scaleChannel.createAttribute('log', DmAttributeType.Element, scaleChannelLog);

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

		var transformPosChannelLog = this.#createDmeTypedLog(DmAttributeType.Vector3, 'vector3 log', [0], [systemTransform.findAttribute('position').value]);
		transformPosChannel.createAttribute('log', DmAttributeType.Element, transformPosChannelLog);

		var transformRotChannelLog = this.#createDmeTypedLog(DmAttributeType.Quaternion, 'quaternion log', [0], [systemTransform.findAttribute('orientation').value]);
		transformRotChannel.createAttribute('log', DmAttributeType.Element, transformRotChannelLog);

		cameraTransformControl.createAttribute('positionChannel', DmAttributeType.Element, transformPosChannel);
		cameraTransformControl.createAttribute('orientationChannel', DmAttributeType.Element, transformRotChannel);

		animSetControlArray.push(cameraTransformControl);
		channelsClip.findAttribute('channels').pushValue(transformPosChannel);
		channelsClip.findAttribute('channels').pushValue(transformRotChannel);
		/**************** /

		this.#pushChannelsClip(channelsClip);
		return animSet;*/
	}

	#createElementFromTemplate(elementType: string, elementName: string): DmElement | null {
		const templates = elementTemplates[elementType];
		let element: DmElement | null = null;

		if (templates) {
			element = DataModel.createElementNew(elementType, elementName);
			Object.keys(templates).forEach((key) => {
				const value = templates[key];

				const attribType = value[0];
				const attribValue = value[1];
				if (attribType == DmAttributeType.Element) {
					const childElement = this.#createElementFromTemplate(attribValue, elementName + '_' + key);
					element!.createAttribute(key, attribType, childElement);
				} else {
					element!.createAttribute(key, attribType, attribValue);
				}
			});
		}

		return element;
	};

	animSetSetControlValue(animSet: DmElement, controlName: string, value: number): void {
		const controlArray = animSet.findAttribute('controls')?.value as DmElement[];
		for (const control of controlArray) {
			const name = control.findAttribute('name')?.value;
			if (controlName == name) {
				//console.log(control);
				control.setAttributeValue('value', value);
			}
		}
	};

}

const cameraChannels = [
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
	'transform': [DmAttributeType.Element, 'DmeTransform', {}],
	'shape': [DmAttributeType.Element, null],
	'visible': [DmAttributeType.Bool, true],
	'children': [DmAttributeType.ElementArray, null],
	'color': [DmAttributeType.Color, vec4.fromValues(255, 255, 255, 255)],
	'intensity': [DmAttributeType.Float, 500.0, { value: 0.5, rescale: { lo: 0, hi: 1000, result: 500 } }],
	'constantAttenuation': [DmAttributeType.Float, 0.0, { value: 0.0, rescale: { lo: 0, hi: 1, result: 0 } }],
	'linearAttenuation': [DmAttributeType.Float, 0.0, { value: 0.0, rescale: { lo: 0, hi: 1000, result: 0 } }],
	'quadraticAttenuation': [DmAttributeType.Float, 1500.0, { value: 0.5, rescale: { lo: 0, hi: 3000, result: 1500 } }],
	'maxDistance': [DmAttributeType.Float, 600.0, { value: 0.1836734712, rescale: { lo: 60, hi: 3000, result: 600 } }],
	'minDistance': [DmAttributeType.Float, 10.0, { value: 0.0301003344, rescale: { lo: 1, hi: 300, result: 10 } }],
	'horizontalFOV': [DmAttributeType.Float, 30.0, { value: 0.1818181872, rescale: { lo: 10, hi: 120, result: 30 } }],
	'verticalFOV': [DmAttributeType.Float, 30.0, { value: 0.1818181872, rescale: { lo: 10, hi: 120, result: 30 } }],
	'ambientIntensity': [DmAttributeType.Float, 0.25, { value: 0.25 }],
	'texture': [DmAttributeType.String, 'effects//gobo_radial'],
	'radius': [DmAttributeType.Float, 0.0, { value: 0.0, rescale: { lo: 0, hi: 50, result: 0 } }],
	'castsShadows': [DmAttributeType.Bool, true],
	'shadowDepthBias': [DmAttributeType.Float, 0.08, { value: 0.08, rescale: { lo: 0, hi: 0.001, result: 0.00008 } }],
	'shadowSlopeScaleDepthBias': [DmAttributeType.Float, 0.2, { value: 0.2, rescale: { lo: 0, hi: 10, result: 2 } }],
	'shadowFilterSize': [DmAttributeType.Float, 0.125, { value: 0.125, rescale: { lo: 0, hi: 24, result: 3 } }],
	'shadowAtten': [DmAttributeType.Float, 1.0, { value: 1.0 }],
	'drawShadowFrustum': [DmAttributeType.Bool, false],
	'jitterSeed': [DmAttributeType.Float, 0.6114993691],
	'animationTime': [DmAttributeType.Time, 0.0],
	'frameRate': [DmAttributeType.Float, 24.0],
	'farZAtten': [DmAttributeType.Float, 0.25, { value: 0.25, rescale: { lo: 0, hi: 3000, result: 750 } }],
	'ambientOcclusion': [DmAttributeType.Float, 1.0],
	'uberlight': [DmAttributeType.Bool, false],
	'nearEdge': [DmAttributeType.Float, 0.4, { value: 0.4, rescale: { lo: 0, hi: 5, result: 2 } }],
	'farEdge': [DmAttributeType.Float, 0.5, { value: 0.5, rescale: { lo: 0, hi: 200, result: 100 } }],
	'cutOn': [DmAttributeType.Float, 0.05, { value: 0.05, rescale: { lo: 0, hi: 200, result: 10 } }],
	'cutOff': [DmAttributeType.Float, 0.5416667, { value: 0.5416667, rescale: { lo: 0, hi: 1200, result: 650 } }],
	'width': [DmAttributeType.Float, 0.03, { value: 0.03, rescale: { lo: 0, hi: 10, result: 0.3 } }],
	'edgeWidth': [DmAttributeType.Float, 0.005, { value: 0.005, rescale: { lo: 0, hi: 10, result: 0.05 } }],
	'height': [DmAttributeType.Float, 0.03, { value: 0.03, rescale: { lo: 0, hi: 10, result: 0.3 } }],
	'edgeHeight': [DmAttributeType.Float, 0.005, { value: 0.005, rescale: { lo: 0, hi: 10, result: 0.05 } }],
	'roundness': [DmAttributeType.Float, 0.8],
	'volumetric': [DmAttributeType.Bool, false],
	'volumetricIntensity': [DmAttributeType.Float, 0.1, { value: 0.1, rescale: { lo: 0, hi: 10, result: 1 } }],
	'noiseStrength': [DmAttributeType.Float, 0.8],
	'flashlightTime': [DmAttributeType.Float, 0.0],
	'numPlanes': [DmAttributeType.Int, 64],
	'planeOffset': [DmAttributeType.Float, 0.8823529482],
	'positionJitter': [DmAttributeType.Vector2, vec2.fromValues(0.5744000077, -0.7741000056)],

	/*
	'noiseStrength':[DmAttributeType.Float, 0.8],
	'flashlightTime':[DmAttributeType.Float, 0.0],
	'numPlanes':[DmAttributeType.Int, 64],
	'planeOffset':[DmAttributeType.Float, 0.8823529482],
	'positionJitter':[DmAttributeType.Vector2, vec2.fromValues(0.5744000077, -0.7741000056)],*/
}
elementTemplates['DmeAnimationSet'] = {
	'controls': [DmAttributeType.ElementArray, null],
	'presetGroups': [DmAttributeType.ElementArray, null],
	'phonememap': [DmAttributeType.ElementArray, null],
	'operators': [DmAttributeType.ElementArray, null],
	'rootControlGroup': [DmAttributeType.Element, 'DmeControlGroup'],
}

elementTemplates['DmeTransform'] = {
	'position': [DmAttributeType.Vector3, vec3.create()],
	'orientation': [DmAttributeType.Quaternion, quat.create()],
}

elementTemplates['DmElement'] = {
}



/**
 * TODO
 */
