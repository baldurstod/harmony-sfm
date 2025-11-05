import { quat, vec3, vec4 } from 'gl-matrix';
import { Property, Scene, Source1MaterialManager, Source1ModelInstance, Source1ParticleSystem } from 'harmony-3d';
import { DmAttributeType } from './dmattributetypes';
import { LookAt, SfmSession } from './sfmsession';

export class SfmExporter {
	static async exportSFM(scene: Scene, mapName: string, rollAngle: number): Promise<File> {
		const originDelta = vec3.fromValues(0, -300, -192);
		const originQuat = quat.create()// = [0, 0, -1, 1];
		const sfm = new SfmSession(mapName);
		sfm.getDefaultAnimationGroups();

		//originQuat = originQuat ?? quat.create();

		quat.normalize(originQuat, originQuat);

		//var ModelListtoto = SourceEngine.Models.ModelManager.getModels();
		const modelList: Set<Source1ModelInstance> = scene.getChildList('Source1ModelInstance') as Set<Source1ModelInstance>;
		//var arr = Object.keys(ModelListtoto);
		//for (var i = 0; i < meetMyTeamCharacterList.length; i++) {
		/*for (var i = 0, l = arr.length; i < l; i++) {
			var currentCharacter = ModelListtoto[arr[i]];

			if (currentCharacter) {
				ExportSFMCharacter(sfm, currentCharacter, currentCharacter.name, originDelta, originQuat);
			}
		}*/
		for (const model of modelList) {
			await this.ExportSFMCharacter(sfm, model, model.name, originDelta, originQuat);

		}


		//const lookAt = [0, 0, 128]; //TODO
		const lookAtPelvis = vec3.fromValues(0, -300, -128); //TODO
		//

		//var cameraPos = [31.058380127, -1138.5904541016, 177.0039367676];
		const cameraPos = vec3.fromValues(0, -600, -192);
		//cameraPos = vec3.add(vec3.create(), originDelta, cameraPos);

		const camera = sfm.createDmeCamera('camera1', cameraPos, lookAtPelvis, rollAngle);
		sfm.filmShot1?.setAttributeValue('camera', camera);
		const mainCameraAnimSet = sfm.createAnimSetForCamera('camera1', camera);
		sfm.camerasDag?.findAttribute('children')?.pushValue(camera);
		sfm.animSetSetControlValue(mainCameraAnimSet, 'bloomScale', 0.0);
		//

		//var overlayEffectsChilds = sfm.overlayEffects?.findAttribute('children');
		/*
		'position' 'vector3' '-196.7075195313 246.0994567871 262.7200927734'
		'orientation' 'quaternion' '-0.0684939995 -0.2947397232 0.2157444805 -0.9283810854'


		'position' 'vector3' '209.9602661133 238.7666625977 266.3461608887'
		'orientation' 'quaternion' '-0.3201268911 -0.0803182051 0.915586412 -0.2297160923'


		'position' 'vector3' '17.8041305542 -219.0653686523 159.2713775635'
		'orientation' 'quaternion' '-0.0429456867 0.0417843573 0.7154440284 0.6960959435'
		*/

		//var lookAt = [0, -300, -128]; //TODO
		/*
		const l1Pos = [-196.7075195313, 246.0994567871, 262.7200927734];
		const l1Quat = [-0.0684939995, -0.2947397232, 0.2157444805, -0.9283810854];

		const l2Pos = [209.9602661133, 238.7666625977, 266.3461608887];
		const l2Quat = [-0.3201268911, -0.0803182051, 0.915586412, -0.2297160923];

		const l3Pos = [17.8041305542, -219.0653686523, 159.2713775635];
		const l3Quat = [-0.0429456867, 0.0417843573, 0.7154440284, 0.6960959435];
		*/

		//var lookAtPelvis = vec3.fromValues(0, -300, -128); //TODO

		/*
		var lights = [
			[-196.7075195313, 246.0994567871, 262.7200927734],
			[209.9602661133, 238.7666625977, 266.3461608887],
			[17.8041305542, -219.0653686523, 159.2713775635],
		];
		*/

		const lights = [
			vec3.fromValues(108.6864318848, -356.833984375, -39.9661140442),
			vec3.fromValues(-88.2010192871, -406.6763916016, -143.8958282471),
			vec3.fromValues(-34.4035644531, -196.7563476563, -93.8829574585),
		];

		/*
		const lights1 = [
			[108.68643188476562, -56.833984375, 152.0338897705078],
			[-88.2010192871, -406.6763916016, -143.8958282471],
			[-34.4035644531, -196.7563476563, -93.8829574585],
		];
		*/

		//var keyPos = [108.6864318848, -356.833984375, -39.9661140442];
		//var fillPos = [-88.2010192871, -406.6763916016, -143.8958282471];
		//var rimPos = [-34.4035644531, -196.7563476563, -93.8829574585];

		for (let i = 0; i < lights.length; i++) {
			//var lightPos = vec3.add(vec3.create(), lights[i], originDelta);
			//lookAtPelvis = vec3.add(vec3.create(), lookAtPelvis, originDelta);
			const lightPos = lights[i]!;

			const light = sfm.addLight('light' + i, lightPos, LookAt(lightPos, lookAtPelvis, [0, 0, 1]))[0];
			if (light) {
				sfm.animSetSetControlValue(light, 'intensity', 0.05);
				sfm.animSetSetControlValue(light, 'horizontalFOV', 1.0);
				sfm.animSetSetControlValue(light, 'verticalFOV', 1.0);
			}

			//sfm.animSetSetControlValue(light, 'intensity', 1.0);
			//sfm.animSetSetControlValue(light, 'horizontalFOV', 0.1);
			//sfm.animSetSetControlValue(light, 'verticalFOV', 0.1);

		}

		/*var l1 = sfm.addLight('light1', l1Pos, l1Quat);
		var l2 = sfm.addLight('light2', l2Pos, l2Quat);
		var l3 = sfm.addLight('light3', l3Pos, l3Quat);

		sfm.animSetSetControlValue(l1[0], 'intensity', 0.05);
		sfm.animSetSetControlValue(l2[0], 'intensity', 0.05);
		sfm.animSetSetControlValue(l3[0], 'intensity', 0.05);

		sfm.animSetSetControlValue(l1[0], 'horizontalFOV', 1.0);
		sfm.animSetSetControlValue(l2[0], 'horizontalFOV', 1.0);
		sfm.animSetSetControlValue(l3[0], 'horizontalFOV', 1.0);

		sfm.animSetSetControlValue(l1[0], 'verticalFOV', 1.0);
		sfm.animSetSetControlValue(l2[0], 'verticalFOV', 1.0);
		sfm.animSetSetControlValue(l3[0], 'verticalFOV', 1.0);*/

		//SaveFile('loadout.tf_SFM_session.dmx', null, null, (sfm.out()));
		//SaveFile('loadout.tf_SFM_session.dmx', b64toBlob(encode64(sfm.out())));
		//return new File([b64toBlob(encode64(sfm.out()))], 'loadout.tf_SFM_session.dmx');
		return new File([sfm.out()], 'loadout.tf_SFM_session.dmx');
	}

	static async ExportSFMCharacter(sfm: SfmSession, prop: Source1ModelInstance, name: string, originDelta: vec3, originQuat: quat): Promise<void> {
		const modelReplace: Record<string, string> = {
			// decorated weapons
			'models/weapons/c_models/c_scattergun.mdl': 'models/weapons/c_models/c_scattergun/c_scattergun_decorated.mdl',
			'models/weapons/c_models/c_wrench/c_wrench.mdl': 'models/weapons/c_models/c_wrench/c_wrench_decorated.mdl',
			'models/weapons/c_models/c_stickybomb_launcher/c_stickybomb_launcher.mdl': 'models/weapons/c_models/c_stickybomb_launcher/c_stickybomb_launcher_decorated.mdl',
			'models/weapons/c_models/c_sniperrifle/c_sniperrifle.mdl': 'models/weapons/c_models/c_sniperrifle/c_sniperrifle_decorated.mdl',
			'models/weapons/c_models/c_smg/c_smg.mdl': 'models/weapons/c_models/c_smg/c_smg_decorated.mdl',
			'models/weapons/c_models/c_shotgun/c_shotgun.mdl': 'models/weapons/c_models/c_shotgun/c_shotgun_decorated.mdl',
			'models/weapons/c_models/c_rocketlauncher/c_rocketlauncher.mdl': 'models/weapons/c_models/c_rocketlauncher/c_rocketlauncher_decorated.mdl',
			'models/weapons/c_models/c_revolver/c_revolver.mdl': 'models/weapons/c_models/c_revolver/c_revolver_decorated.mdl',
			'models/weapons/c_models/c_pistol/c_pistol.mdl': 'models/weapons/c_models/c_pistol/c_pistol_decorated.mdl',
			'models/weapons/c_models/c_minigun/c_minigun.mdl': 'models/weapons/c_models/c_minigun/c_minigun_decorated.mdl',
			'models/weapons/c_models/c_medigun/c_medigun.mdl': 'models/weapons/c_models/c_medigun/c_medigun_decorated.mdl',
			'models/weapons/c_models/c_knife/c_knife.mdl': 'models/weapons/c_models/c_knife/c_knife_decorated.mdl',
			'models/weapons/c_models/c_grenadelauncher/c_grenadelauncher.mdl': 'models/weapons/c_models/c_grenadelauncher/c_grenadelauncher_decorated.mdl',
			'models/weapons/c_models/c_flamethrower/c_flamethrower.mdl': 'models/weapons/c_models/c_flamethrower/c_flamethrower_decorated.mdl',
			'models/workshop/weapons/c_models/c_blackbox/c_blackbox.mdl': 'models/workshop/weapons/c_models/c_blackbox/c_blackbox_decorated.mdl',
			'models/workshop/weapons/c_models/c_tomislav/c_tomislav.mdl': 'models/workshop/weapons/c_models/c_tomislav/c_tomislav_decorated.mdl',
			// nostromo
			'models/workshop_partner/weapons/c_models/c_ai_flamethrower/c_ai_flamethrower.mdl': 'models/workshop/weapons/c_models/c_ai_flamethrower/c_ai_flamethrower.mdl',
			// phlog
			"models/workshop/weapons/c_models/c_drg_phlogistinator/c_drg_phlogistinator.mdl": "models/weapons/c_models/c_drg_phlogistinator/c_drg_phlogistinator.mdl",
			// King of Scotland Cape
			"models/workshop_partner/player/items/demo/tw_kingcape/tw_kingcape.mdl": "models//player/items/demo/tw_kingcape/tw_kingcape.mdl"
		}
		if (prop) {
			let modelPath = prop.sourceModel.fileName.replace(/\.mdl$/, '') + '.mdl';
			const replacementModel = modelReplace[modelPath];
			if (replacementModel) {
				modelPath = replacementModel;
			}

			let modelOrigin = vec3.transformQuat(vec3.create(), prop.getWorldPosition(), originQuat);
			vec3.add(modelOrigin, modelOrigin, originDelta);
			let modelOrientation = quat.mul(quat.create(), originQuat, prop.getWorldQuaternion());
			//vec3.transformQuat(modelOrigin, modelOrigin, originQuat);
			modelOrigin = originDelta;
			modelOrientation = originQuat;

			const characterGameModel = sfm.createAnimSetForModel(name, modelPath, prop, modelOrigin, modelOrientation, prop.parent?.getProperty('characterGameModel')?.value);
			if (!characterGameModel) {
				return;
			}
			prop.setProperty('characterGameModel', new Property('dmelement', characterGameModel));

			const parentProp = prop.parent;
			if (parentProp) {
				const parentPropGameModel = parentProp.getProperty('characterGameModel');
				if (parentPropGameModel) {
					//sfm.makeChild(characterGameModel, parentPropGameModel);
				}
			}

			//if (prop.tint)
			{
				const textureList = prop.sourceModel.mdl.textures;//TODOV2
				if (textureList) {
					for (const texture of textureList) {
						const materialName = prop.sourceModel.mdl.getMaterialName(Number(prop.skin), 0);//TODO
						//var mat = SourceEngine.Materials.MaterialManager.getMaterial(materialName, prop.sourceModel.mdl.getTextureDir(), prop.sourceModel.materialRepository);
						await Source1MaterialManager.getMaterial(prop.sourceModel.repository, materialName, prop.sourceModel.mdl.getTextureDir());

						const textureName = texture.name;
						//var textureName = mat.materialName;

						//console.log(itemModel);
						const overrideMaterial = sfm.createDmeMaterial(textureName);

						const tint = prop.getTint();
						if (tint) {
							const colorTintBase = ColorFloatToVec4(tint) ?? vec4.fromValues(255, 255, 255, 255);
							overrideMaterial.createAttribute('$colortint_base', DmAttributeType.Color, colorTintBase);
						}

						if (prop.getProperty('weapon_stattrak_kill_count')) {
							const result = /stattrack_dial(\d*)$/.exec(textureName);
							if (result && result[1]) {
								const digitPos = parseInt(result[1], 10);
								const s = '000000' + (prop.getProperty('weapon_stattrak_kill_count')?.value as number ?? 0).toString();
								const startPos = s.length - 1 - digitPos;
								const digit = parseInt(s[startPos]!, 10);
								//console.log(result);
								overrideMaterial.createAttribute('$frame', DmAttributeType.Int, digit);
							}
						}

						sfm.addGameModelMaterial(characterGameModel, overrideMaterial);
					}
				}
			}

			const effectsList = prop.children as Set<Source1ParticleSystem>;
			if (effectsList) {
				for (const effect of effectsList) {
					if (!effect.isParticleSystem) {
						continue
					}
					let boneName = null;
					//var effect = effectsList[effectIndex];

					boneName = effect?.getControlPoint(0)?.parent?.name;

					sfm.createAnimSetForParticleSystem(effect.name, undefined, effect.name, characterGameModel, boneName ?? '', effect.getControlPoints());
				}
			}
		}
	}
}


function ColorFloatToVec4(color: vec4): vec4 {
	if (!color) {
		return vec4.fromValues(255, 255, 255, 255);
	}
	return vec4.fromValues(
		Math.round(color[0] * 255),
		Math.round(color[1] * 255),
		Math.round(color[2] * 255),
		color[3] === undefined ? 255 : Math.round(color[3] * 255)
	);
}

/*
function ColorIntToVec4(color) {
	return vec4.fromValues(
		((color & 0xFF0000) >> 16),
		((color & 0x00FF00) >> 8),
		((color & 0x0000FF) >> 0),
		255
	);
}
*/
