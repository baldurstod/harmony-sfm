import { ControlPoint } from 'harmony-3d';
import { JSONObject } from 'harmony-types';
import { quat } from 'gl-matrix';
import { Scene } from 'harmony-3d';
import { Source1ModelInstance } from 'harmony-3d';
import { vec2 } from 'gl-matrix';
import { vec3 } from 'gl-matrix';
import { vec4 } from 'gl-matrix';

declare class DmAttribute {
    #private;
    readonly owner: DmElement;
    readonly name: string;
    readonly type: DmAttributeType;
    value: DmAttributeValue | null;
    m_Handle: number;
    next: DmAttribute | null;
    m_nFlags: number;
    static s_pAttrInfo: DmAttributeInfo[];
    constructor(owner: DmElement, type: DmAttributeType, name: string);
    static createAttribute(owner: DmElement, type: DmAttributeType, name: string): DmAttribute | null;
    setNextAttribute(attribute: DmAttribute | null): void;
    getNextAttribute(): DmAttribute | null;
    checkCyclicRedundancy(other: DmAttribute): boolean;
    findAttribute(attributeName: string): DmAttribute | null;
    nextAttribute(): DmAttribute | null;
    isFlagSet(flags: number): boolean;
    setValue(value: DmAttributeValue | null): void;
    getValue(): DmAttributeValue | null;
    pushValue(value: DmAttributeValue | null): void;
    serialize(buf: UtlBuffer): void;
    serializeIndex(index: number, buf: UtlBuffer): void;
    serializesOnMultipleLines(): boolean;
}

declare class DmAttributeInfo {
    readonly attributeType: DmAttributeType;
    readonly attributeName: string;
    readonly defaultSetStatement: string | undefined;
    constructor(_className: string, _storageType: string, _attributeType: DmAttributeType, _attributeName: string, _defaultSetStatement?: string);
    getAttributeType(): DmAttributeType;
    getAttributeTypeName(): string;
}

declare class DmAttributeList {
    m_hAttribute: number;
    m_pNext: null;
}

declare enum DmAttributeType {
    Unknown = 0,
    Element = 1,
    Int = 2,
    Float = 3,
    Bool = 4,
    String = 5,
    Void = 6,
    ObjectId = 7,
    Time = 8,
    Color = 9,
    Vector2 = 10,
    Vector3 = 11,
    Vector4 = 12,
    QAngle = 13,
    Quaternion = 14,
    VMatrix = 15,
    ElementArray = 16,
    IntArray = 17,
    FloatArray = 18,
    BoolArray = 19,
    StringArray = 20,
    VoidArray = 21,
    ObjectIdArray = 22,
    TimeArray = 23,
    ColorArray = 24,
    Vector2Array = 25,
    Vector3Array = 26,
    Vector4Array = 27,
    QAngleArray = 28,
    QuaternionArray = 29,
    VMatrixArray = 30
}

declare type DmAttributeValue = DmAttributeValueSingle | DmAttributeValueSingle[];

declare type DmAttributeValueSingle = string | DmElement | boolean | number | vec2 | vec3 | vec4;

declare class DmElement {
    #private;
    isDmElement: true;
    m_pAttributes: DmAttribute | null;
    m_ref: DmElementReference;
    m_Type: string;
    m_bBeingUnserialized: boolean;
    m_bIsAcessible: boolean;
    m_Id: UniqueId;
    m_fileId?: never;
    constructor(handle: number, pElementType: string, id: UniqueId, pElementName: string, fileid?: never);
    createAttribute(attributeName: string, attributeType: DmAttributeType, attributeValue: any): DmAttribute | null;
    hasAttribute(attributeName: string, attributeType: DmAttributeType): boolean;
    findAttribute(attributeName: string): DmAttribute | null;
    setAttributeValue(attributeName: string, value: any): void;
    markDirty(): void;
    getHandle(): number;
    getId(): UniqueId;
    firstAttribute(): DmAttribute | null;
    getTypeString(): string;
}

declare class DmElementReference {
    elementHandle: number;
    m_nWeakHandleCount: number;
    m_nStrongHandleCount: number;
    m_attributes: DmAttributeList;
    constructor(handle: number);
}

export declare class SfmExporter {
    static exportSFM(scene: Scene, mapName: string, rollAngle: number): Promise<File>;
    static ExportSFMCharacter(sfm: SfmSession, prop: Source1ModelInstance, name: string, originDelta: vec3, originQuat: quat): Promise<void>;
}

declare class SfmSession {
    #private;
    filmShot1?: DmElement;
    animSetEditorChannels?: DmElement;
    camerasDag?: DmElement;
    lightsDag?: DmElement;
    scene?: DmElement;
    overlayEffects?: DmElement;
    static defaultAnimationGroups?: JSONObject;
    constructor(mapName?: string, clipName?: string);
    out(): string;
    createDmeTrack(trackName: string, children?: DmElement[], clipType?: number): DmElement;
    createDmeCamera(cameraName: string, cameraPos: vec3, cameraLookAt: vec3, rollAngle: number): DmElement;
    createDmeGlobalFlexControllerOperator(name: string, flexWeight: number, gameModel: DmElement): DmElement;
    createDmeDag(name: string, transform: DmElement, children?: DmElement[]): DmElement;
    createDmeGameParticleSystem(name: string, systemName: string, transform: DmElement): DmElement;
    createDmeMaterial(mtlName: string): DmElement;
    addGameModelMaterial(gameModel: DmElement, material: DmElement): void;
    createAnimSetForModel(name: string, modelPath: string, dynamicProp: Source1ModelInstance, position: vec3, quaternion: quat, parentGameModel: DmElement | undefined, viewTargetPos?: vec3): DmElement | null;
    getDefaultAnimationGroups(): JSONObject;
    createAnimSetForCamera(name: string, camera: DmElement): DmElement;
    createRescaleOperator(name: string, result: number, lo: number, hi: number): DmElement;
    createAnimSetForParticleSystem(name: string, _: undefined, systemName: string, parentGameModel: DmElement, boneName: string, controlPoints: ControlPoint[]): DmElement;
    makeChild(gameModel: DmElement, parentGameModel: DmElement): void;
    createDmeTextFXClip(name: string, text: string, textColor: vec4 | undefined, fontName: string): DmElement;
    DmeMaterialOverlayFXClip(name: string, overlayColor: vec4 | undefined, materialName: string): DmElement;
    addLight(lightName: string, cameraPos: vec3, cameraOrientation: quat): [DmElement | null, DmElement | null];
    animSetSetControlValue(animSet: DmElement, controlName: string, value: number): void;
}

declare class UniqueId {
    value?: string;
    createUniqueId(): void;
    Serialize(buf: UtlBuffer): boolean;
}

declare class UtlBuffer {
    #private;
    constructor(flags: number);
    isText(): boolean;
    pushTab(): void;
    popTab(): void;
    putChar(c: string): void;
    putString(s: string): void;
    putDelimitedString(s: string): void;
    isValid(): boolean;
    getBuffer(): string;
}

export { }
