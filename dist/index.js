import { quat, vec4, vec3, mat3, vec2 } from 'gl-matrix';
import { degToRad, SourceModel, Skeleton, Property, Source1MaterialManager } from 'harmony-3d';

/*
export const DmAttributeType.Unknown = 0;

export const AT_FIRST_VALUE_TYPE = 1;

export const DmAttributeType.Element = AT_FIRST_VALUE_TYPE;
export const DmAttributeType.Int = 2;
export const DmAttributeType.Float = 3;
export const DmAttributeType.Bool = 4;
export const DmAttributeType.String = 5;
export const DmAttributeType.Void = 6;
export const DmAttributeType.ObjectId = 7;
export const DmAttributeType.Time = 7;
export const DmAttributeType.Color = 8; //rgba
export const DmAttributeType.Vector2 = 9;
export const DmAttributeType.Vector3 = 10;
export const DmAttributeType.Vector4 = 11;
export const DmAttributeType.QAngle = 12;
export const DmAttributeType.Quaternion = 13;
export const DmAttributeType.VMatrix = 14;

export const AT_FIRST_ARRAY_TYPE = 15;

export const DmAttributeType.ElementArray = AT_FIRST_ARRAY_TYPE;
export const DmAttributeType.IntArray = AT_FIRST_ARRAY_TYPE + 1;
export const DmAttributeType.FloatArray = AT_FIRST_ARRAY_TYPE + 2;
export const DmAttributeType.BoolArray = AT_FIRST_ARRAY_TYPE + 3;
export const DmAttributeType.StringArray = AT_FIRST_ARRAY_TYPE + 4;
export const DmAttributeType.VoidArray = AT_FIRST_ARRAY_TYPE + 5;
export const DmAttributeType.ObjectIdArray = AT_FIRST_ARRAY_TYPE + 6;
export const DmAttributeType.TimeArray = AT_FIRST_ARRAY_TYPE + 6;
export const DmAttributeType.ColorArray = AT_FIRST_ARRAY_TYPE + 7;
export const DmAttributeType.Vector2Array = AT_FIRST_ARRAY_TYPE + 8;
export const DmAttributeType.Vector3Array = AT_FIRST_ARRAY_TYPE + 9;
export const DmAttributeType.Vector4Array = AT_FIRST_ARRAY_TYPE + 10;
export const DmAttributeType.QAngleArray = AT_FIRST_ARRAY_TYPE + 11;
export const DmAttributeType.QuaternionArray = AT_FIRST_ARRAY_TYPE + 12;
export const DmAttributeType.VMatrixArray = AT_FIRST_ARRAY_TYPE + 13;
export const AT_TYPE_COUNT = AT_FIRST_ARRAY_TYPE + 14;
*/
var DmAttributeType;
(function (DmAttributeType) {
    // TODO: turn numeric
    DmAttributeType[DmAttributeType["Unknown"] = 0] = "Unknown";
    DmAttributeType[DmAttributeType["Element"] = 1] = "Element";
    DmAttributeType[DmAttributeType["Int"] = 2] = "Int";
    DmAttributeType[DmAttributeType["Float"] = 3] = "Float";
    DmAttributeType[DmAttributeType["Bool"] = 4] = "Bool";
    DmAttributeType[DmAttributeType["String"] = 5] = "String";
    DmAttributeType[DmAttributeType["Void"] = 6] = "Void";
    DmAttributeType[DmAttributeType["ObjectId"] = 7] = "ObjectId";
    DmAttributeType[DmAttributeType["Time"] = 7] = "Time";
    DmAttributeType[DmAttributeType["Color"] = 8] = "Color";
    DmAttributeType[DmAttributeType["Vector2"] = 9] = "Vector2";
    DmAttributeType[DmAttributeType["Vector3"] = 10] = "Vector3";
    DmAttributeType[DmAttributeType["Vector4"] = 11] = "Vector4";
    DmAttributeType[DmAttributeType["QAngle"] = 12] = "QAngle";
    DmAttributeType[DmAttributeType["Quaternion"] = 13] = "Quaternion";
    DmAttributeType[DmAttributeType["VMatrix"] = 14] = "VMatrix";
    // Arrays
    DmAttributeType[DmAttributeType["ElementArray"] = 15] = "ElementArray";
    DmAttributeType[DmAttributeType["IntArray"] = 16] = "IntArray";
    DmAttributeType[DmAttributeType["FloatArray"] = 17] = "FloatArray";
    DmAttributeType[DmAttributeType["BoolArray"] = 18] = "BoolArray";
    DmAttributeType[DmAttributeType["StringArray"] = 19] = "StringArray";
    DmAttributeType[DmAttributeType["VoidArray"] = 20] = "VoidArray";
    DmAttributeType[DmAttributeType["ObjectIdArray"] = 21] = "ObjectIdArray";
    DmAttributeType[DmAttributeType["TimeArray"] = 21] = "TimeArray";
    DmAttributeType[DmAttributeType["ColorArray"] = 22] = "ColorArray";
    DmAttributeType[DmAttributeType["Vector2Array"] = 23] = "Vector2Array";
    DmAttributeType[DmAttributeType["Vector3Array"] = 24] = "Vector3Array";
    DmAttributeType[DmAttributeType["Vector4Array"] = 25] = "Vector4Array";
    DmAttributeType[DmAttributeType["QAngleArray"] = 26] = "QAngleArray";
    DmAttributeType[DmAttributeType["QuaternionArray"] = 27] = "QuaternionArray";
    DmAttributeType[DmAttributeType["VMatrixArray"] = 28] = "VMatrixArray";
})(DmAttributeType || (DmAttributeType = {}));
DmAttributeType.Element;
const DmAttributeTypeFirstArray = DmAttributeType.ElementArray;
DmAttributeType.VMatrix;
const DmAttributeTypeLastArray = DmAttributeType.VMatrixArray;
/*
export enum DmAttributeType {
    // TODO: turn numeric
    Unknown = 'Unknown',
    Element = 'Element',
    Int = 'Int',
    Float = 'Float',
    Bool = 'Bool',
    String = 'String',
    Void = 'Void',
    ObjectId = 'ObjectId',
    Time = 'Time',
    Color = 'Color',
    Vector2 = 'Vector2',
    Vector3 = 'Vector3',
    Vector4 = 'Vector4',
    QAngle = 'QAngle',
    Quanternion = 'Quanternion',
    VMatrix = 'VMatrix',

    // Arrays
    ElementArray = 'ElementArray',
    IntArray = 'IntArray',
    FloatArray = 'FloatArray',
    BoolArray = 'BoolArray',
    StringArray = 'StringArray',
    VoidArray = 'VoidArray',
    ObjectIdArray = 'ObjectIdArray',
    TimeArray = 'TimeArray',
    ColorArray = 'ColorArray',
    Vector2Array = 'Vector2Array',
    Vector3Array = 'Vector3Array',
    Vector4Array = 'Vector4Array',
    QAngleArray = 'QAngleArray',
    QuanternionArray = 'QuanternionArray',
    VMatrixArray = 'VMatrixArray',
}
*/

var groupFile={Face:{Eyes:{groupColor:"255 128 32 255",control:["eyes_updown","eyes_rightleft","eyes_convergence","localViewTargetFactor","viewTarget","eyeDownAndUpL","eyeDownAndUpR","eyeRightAndLeftL","eyeRightAndLeftR","eyeUp","eyeDown","eyeLeft","eyeRight","eyeClosed-eyeUp","eyeClosed-eyeDown","eyeDownAndUp","eyeRightAndLeft"]},"Full Face":{groupColor:"255 128 32 255",control:["defaultFace","happyBig","mad","happySmall","painSmall","scared","silence","specialAction01","painBig","happy","dead","evilHappy","drunkHappy","pain","happyBigClosed","silence1","upset1","dead03","actionfire01","happy1","dead02","upset2","actionfire02","happybig02","happysmall02","idleface","dead01","Neutral","painScared","evilSmile","Cocky","Aggressive","MouthWide","Skeptical","ScaredClosed","HappySmallClosed","PainBigClosed","AggresiveClosed","Smile01","Smile02"]},"Upper Face":{groupColor:"255 128 32 255",control:["BrowInV","BrowOutV","Frown","InnerSquint","OuterSquint","ScalpD","CloseLid","CloseLidV","multi_CloseLid","innerBrowRaiser","innerBrowRaiserL","innerBrowRaiserR","outerBrowRaiser","outerBrowRaiserL","outerBrowRaiserR","browCorrugators","innerBrowLowerer","innerBrowLowererL","innerBrowLowererR","outerBrowLowerer","outerBrowLowererL","outerBrowLowererR","eyeClosedAndLidRaiser","eyeClosedAndLidRaiserL","eyeClosedAndLidRaiserR","lidTightener","lidTightenerL","lidTightenerR","squint","squintL","squintR","blink","specialAction01Upper","painBigUpper","happySmallUpper","happyBigUpper","painSmallUpper","defaultFaceUpper","madUpper","scaredUpper","happyUpper","painUpper","screamingUpper","upperAngry3","upperSad3","upperSad1","upperSuprise1","upperAngry2","upperHappy1","upperHappy2","upperUpset1","happyBig02Upper","evilSmileUpper","yellingUpper","evilHappyUpper","painScaredUpper","half_closed","lid_squinter","innerBrowRaiser","outerBrowRaiser","browLowerer","upperLidRaiser","eyeClosed","squint","eyeClosedAndLidRaiser","lid_raiser","lid_tightener","lid_droop","lid_closer","inner_raiser","outer_raiser","lowerer"]},"Mid Face":{groupColor:"255 128 32 255",control:["NoseV","NostrilFlare","CheekV","CheekH","CheekRaiser","CheekRaiserL","CheekRaiserR","noseWrinkler","noseWrinklerL","noseWrinklerR","upperCheekSuckAndPuff","upperCheekSuckAndPuffL","upperCheekSuckAndPuffR","lowerCheekSuckAndPuff","lowerCheekSuckAndPuffL","lowerCheekSuckAndPuffR","nosePressorAndNasolabialFurrow","nosePressorAndNasolabialFurrowL","nosePressorAndNasolabialFurrowR","nostrilCompressorAndDilator","nostrilCompressorAndDilatorL","nostrilCompressorAndDilatorR","cheek_puffer","cheekRaiser","dimpler","noseWrinkler","nostrilDilator","cheek_raiser","wrinkler","dilator"]},"Lower Face":{groupColor:"255 128 32 255",control:["JawV","JawD","JawH","jawOpenCloseMouth","LipsV","LipUpV","LipLoV","FoldLipUp","FoldLipLo","PuckerLipUp","PuckerLipLo","PuffLipUp","PuffLipLo","Smile","value_Smile","multi_Smile","Platysmus","LipCnrTwst","Dimple","ZipLips","jawClencherAndOpen","jawSuckAndThrust","jawSideways","jawOpenCloseMouthDelta","jawOpenCloseMouthFull","upperLipsTowardAndPart","upperLipsTowardAndPartL","upperLipsTowardAndPartR","lowerLipsTowardAndPart","lowerLipsTowardAndPartL","lowerLipsTowardAndPartR","upperLipsMidTowardAndPart","lowerLipsMidTowardAndPart","upperLipRaiser","upperLipRaiserL","upperLipRaiserR","lowerLipDepressorAndChinRaiser","lowerLipDepressorAndChinRaiserL","lowerLipDepressorAndChinRaiserR","upperLipPressor","upperLipPressorL","upperLipPressorR","lowerLipPressor","lowerLipPressorL","lowerLipPressorR","lipTightener","lipTightenerL","lipTightenerR","dimpler","dimplerL","dimplerR","lipCornerPressor","lipCornerPressorL","lipCornerPressorR","lipCornerPuller","lipCornerPullerL","lipCornerPullerR","lipStretcher","lipStretcherL","lipStretcherR","lipCornerDepressorAndSharpLipPuller","lipCornerDepressorAndSharpLipPullerL","lipCornerDepressorAndSharpLipPullerR","lipPuckerer","lipPuckererL","lipPuckererR","upperLipSuckAndFunneler","upperLipSuckAndFunnelerL","upperLipSuckAndFunnelerR","lowerLipSuckAndFunneler","lowerLipSuckAndFunnelerL","lowerLipSuckAndFunnelerR","lipSideways","upperLipInAndOutTweak","upperLipInAndOutTweakL","upperLipInAndOutTweakR","lowerLipInAndOutTweak","lowerLipInAndOutTweakL","lowerLipInAndOutTweakR","chinRaiserLipsParted","chinRaiserLipsPartedL","chinRaiserLipsPartedR","TurtleneckCenter","TurtleneckRight","TurtleneckLeft","OO","WQ","AW","OH","UH","ER","SH","GK","DS","T","N","TH","EE","Y","AE","AH","MB","PP","FV","EH","AE2","IH","RR","EEE","WQU","FFF","AIY","ST","LTH","p","openJaw","mouth_sideways","jaw_sideways","lowerLipsToward","upperLipsPart","lowerLipsPart","upperLipRaiser","lowerLipDepressor","chinRaiser","lipCornerDepressor","lipPressor","sharpLipPuller","lipCornerPuller","lipStretcher","lipPuckerer","upperLipFunneler","lowerLipFunneler","lowerLipSuck","lipSidewaysL","lipSidewaysR","jawThrust","jawSuck","jawSidewaysL","jawSidewaysR","jawOpen","jawClencher","jawOpen-lipCornerPuller","lipPuckerer-lowerLipFunneler","lipPuckerer-upperLipFunneler","upperLipsTowardAndPart","lowerLipsTowardAndPart","lowerLipDepressorAndChinRaiser","lipCornerDepressorAndSharpLipPuller","phonemeFV","phonemeBMP","upper_raiser","corner_puller","corner_depressor","chin_raiser","part","puckerer","funneler","stretcher","bite","presser","tightener","jaw_clencher","jaw_drop","mouth_drop","lower_lip"]},Tongue:{groupColor:"255 128 32 255",control:["TongueV","TongueD","TongueH","TongueCurl","TongueFunnel","TongueWidth","tongueOut","tongueRetract","tongueCurveUp","tongueCurveDown","tongueRight","tongueLeft","tongueUp","tongueNarrow"]}},Body:{control:["rootTransform","bip_pelvis","bip_spine_0","bip_spine_1","bip_spine_2","bip_spine_3","bip_neck","bip_head","ValveBiped.Bip01_pelvis","ValveBiped.Bip01_spine_0","ValveBiped.Bip01_spine_1","ValveBiped.Bip01_spine_2","ValveBiped.Bip01_spine_3","ValveBiped.Bip01_neck","ValveBiped.Bip01_head","Bip01_pelvis","Bip01_spine_0","Bip01_spine_1","Bip01_spine_2","Bip01_spine_3","Bip01_neck","Bip01_head","ValveBiped.Bip01_Spine","ValveBiped.Bip01_Spine1","ValveBiped.Bip01_Spine2","ValveBiped.Bip01_Spine3","ValveBiped.Bip01_Spine4","ValveBiped.Bip01_Neck1","ValveBiped.Bip01_Head1","Bip01_Neck1","Bip01_Head1","Bip01_Spine","Bip01_Spine1","Bip01_Spine2","Bip01_Spine3","Bip01_Spine4","root_joint","spine_mid_joint","spine_end_joint","head_base_joint","root","root_0","Jaw","head","head1","head_0","head_1","neck1","spine_0","spine_1","spine_2","spine_3","spine1","spine2","spine3","spine11","spine21","spine31","spine1_1","spine1_2","spine1_3","spine2_1","spine2_2","spine2_3"]},Arms:{control:["bip_collar_L","bip_upperArm_L","bip_lowerArm_L","bip_hand_L","ValveBiped.Bip01_L_Clavicle","ValveBiped.Bip01_L_UpperArm","ValveBiped.Bip01_L_Forearm","ValveBiped.Bip01_L_Hand","Bip01_L_Clavicle","Bip01_L_UpperArm","Bip01_L_Forearm","Bip01_L_Hand","bip_collar_R","bip_upperArm_R","bip_lowerArm_R","bip_hand_R","ValveBiped.Bip01_R_Clavicle","ValveBiped.Bip01_R_UpperArm","ValveBiped.Bip01_R_Forearm","ValveBiped.Bip01_R_Hand","Bip01_R_Clavicle","Bip01_R_UpperArm","Bip01_R_Forearm","Bip01_R_Hand","L_upArm_joint","L_foreArm_joint","L_wrist_joint","R_upArm_joint","R_foreArm_joint","R_wrist_joint","clavicle_L","bicep_L","elbow_L","wrist_L","clavicle_R","bicep_R","elbow_R","wrist_R","bicep_A_R","elbow_A_R","wrist_A_R","clavicle_A_R","bicep_A_L","elbow_A_L","wrist_A_L","clavicle_A_L"]},Fingers:{RightFingers:{groupColor:"200 64 64 255",control:["bip_thumb_0_R","bip_thumb_1_R","bip_thumb_2_R","bip_index_0_R","bip_index_1_R","bip_index_2_R","bip_middle_0_R","bip_middle_1_R","bip_middle_2_R","bip_ring_0_R","bip_ring_1_R","bip_ring_2_R","bip_pinky_0_R","bip_pinky_1_R","bip_pinky_2_R","Bip01_R_thumb_0","Bip01_R_thumb_1","Bip01_R_thumb_2","Bip01_R_index_0","Bip01_R_index_1","Bip01_R_index_2","Bip01_R_middle_0","Bip01_R_middle_1","Bip01_R_middle_2","Bip01_R_ring_0","Bip01_R_ring_1","Bip01_R_ring_2","Bip01_R_pinky_0","Bip01_R_pinky_1","Bip01_R_pinky_2","Bip01_R_Finger0","Bip01_R_Finger01","Bip01_R_Finger02","Bip01_R_Finger1","Bip01_R_Finger11","Bip01_R_Finger12","Bip01_R_Finger2","Bip01_R_Finger21","Bip01_R_Finger22","Bip01_R_Finger3","Bip01_R_Finger31","Bip01_R_Finger32","Bip01_R_Finger4","Bip01_R_Finger41","Bip01_R_Finger42","ValveBiped.Bip01_R_Finger0","ValveBiped.Bip01_R_Finger01","ValveBiped.Bip01_R_Finger02","ValveBiped.Bip01_R_Finger1","ValveBiped.Bip01_R_Finger11","ValveBiped.Bip01_R_Finger12","ValveBiped.Bip01_R_Finger2","ValveBiped.Bip01_R_Finger21","ValveBiped.Bip01_R_Finger22","ValveBiped.Bip01_R_Finger3","ValveBiped.Bip01_R_Finger31","ValveBiped.Bip01_R_Finger32","ValveBiped.Bip01_R_Finger4","ValveBiped.Bip01_R_Finger41","ValveBiped.Bip01_R_Finger42","Bip01_R_Mid_0","Bip01_R_Mid_1","Bip01_R_Mid_2","thumb_R_1","thumb_R_2","index_R_1","index_R_2","mid_R_1","mid_R_2","pinky_R_1","pinky_R_2","thumb_0_R","thumb_1_R","thumb_2_R","index_0_R","index_1_R","index_2_R","mid_0_R","mid_1_R","mid_2_R","ring_0_R","ring_1_R","ring_2_R","pinky_0_R","pinky_1_R","pinky_2_R"]},LeftFingers:{groupColor:"64 200 64 255",control:["bip_thumb_0_L","bip_thumb_1_L","bip_thumb_2_L","bip_index_0_L","bip_index_1_L","bip_index_2_L","bip_middle_0_L","bip_middle_1_L","bip_middle_2_L","bip_ring_0_L","bip_ring_1_L","bip_ring_2_L","bip_pinky_0_L","bip_pinky_1_L","bip_pinky_2_L","Bip01_L_thumb_0","Bip01_L_thumb_1","Bip01_L_thumb_2","Bip01_L_index_0","Bip01_L_index_1","Bip01_L_index_2","Bip01_L_middle_0","Bip01_L_middle_1","Bip01_L_middle_2","Bip01_L_ring_0","Bip01_L_ring_1","Bip01_L_ring_2","Bip01_L_pinky_0","Bip01_L_pinky_1","Bip01_L_pinky_2","Bip01_L_Finger0","Bip01_L_Finger01","Bip01_L_Finger02","Bip01_L_Finger1","Bip01_L_Finger11","Bip01_L_Finger12","Bip01_L_Finger2","Bip01_L_Finger21","Bip01_L_Finger22","Bip01_L_Finger3","Bip01_L_Finger31","Bip01_L_Finger32","Bip01_L_Finger4","Bip01_L_Finger41","Bip01_L_Finger42","ValveBiped.Bip01_L_Finger0","ValveBiped.Bip01_L_Finger01","ValveBiped.Bip01_L_Finger02","ValveBiped.Bip01_L_Finger1","ValveBiped.Bip01_L_Finger11","ValveBiped.Bip01_L_Finger12","ValveBiped.Bip01_L_Finger2","ValveBiped.Bip01_L_Finger21","ValveBiped.Bip01_L_Finger22","ValveBiped.Bip01_L_Finger3","ValveBiped.Bip01_L_Finger31","ValveBiped.Bip01_L_Finger32","ValveBiped.Bip01_L_Finger4","ValveBiped.Bip01_L_Finger41","ValveBiped.Bip01_L_Finger42","Bip01_L_Mid_0","Bip01_L_Mid_1","Bip01_L_Mid_2","thumb_L_1","thumb_L_2","index_L_1","index_L_2","mid_L_1","mid_L_2","pinky_L_1","pinky_L_2","thumb_0_L","thumb_1_L","thumb_2_L","index_0_L","index_1_L","index_2_L","mid_0_L","mid_1_L","mid_2_L","ring_0_L","ring_1_L","ring_2_L","pinky_0_L","pinky_1_L","pinky_2_L"]}},Legs:{control:["bip_hip_L","bip_knee_L","bip_foot_L","bip_toe_L","ValveBiped.Bip01_L_Thigh","ValveBiped.Bip01_L_Calf","ValveBiped.Bip01_L_Foot","ValveBiped.Bip01_L_Toe0","Bip01_L_Thigh","Bip01_L_Calf","Bip01_L_Foot","Bip01_L_Toe0","bip_hip_R","bip_knee_R","bip_foot_R","bip_toe_R","ValveBiped.Bip01_R_Thigh","ValveBiped.Bip01_R_Calf","ValveBiped.Bip01_R_Foot","ValveBiped.Bip01_R_Toe0","Bip01_R_Thigh","Bip01_R_Calf","Bip01_R_Foot","Bip01_R_Toe0","hip_joint","L_thigh_joint","L_knee_joint","L_ankle_joint","L_ball_joint","R_thigh_joint","R_knee_joint","R_ankle_joint","R_ball_joint","thigh_L","knee_L","ankle_L","toeBase_L","toeBall_L","thigh_R","knee_R","ankle_R","toeBase_R","toeBall_R","thigh_A_L","knee_A_L","ankle_A_L","thigh_A_R","knee_A_R","ankle_A_R"]},Toes:{RightToes:{groupColor:"200 64 64 255",control:["bigToe_R_1","indexToe_R_1","midToe_R_1","pinkyToe_R_1"]},LeftToes:{groupColor:"64 200 64 255",control:["bigToe_L_1","indexToe_L_1","midToe_L_1","pinkyToe_L_1"]}},Other:{control:["weapon_bone","prp_bullet_shoulder","prp_bullet_backUpper","prp_bullet_backLower","prp_bullet_chestUpper","prp_bullet_side","prp_bullet_chestLower","prp_pack"]},RigBody:{control:["rig_root","rig_pelvis","rig_hips","rig_spine_0","rig_spine_1","rig_spine_2","rig_chest","rig_neck","rig_head"]},RigArms:{control:["rig_collar_R","rig_elbow_R","rig_hand_R","rig_collar_L","rig_elbow_L","rig_hand_L"]},RigLegs:{control:["rig_knee_R","rig_foot_R","rig_toe_R","rig_knee_L","rig_foot_L","rig_toe_L","rig_footRoll_R","rig_footRoll_L"]},RigHelpers:{visible:"0",snap:"0",control:["rig_heel_R","rig_reverseHeel_R","rig_footIK_R","rig_footHelper_R","rig_heel_L","rig_reverseHeel_L","rig_footIK_L","rig_footHelper_L"]},Attachments:{visible:"0",control:["attach_pvt_heel_R","attach_pvt_toe_R","attach_pvt_outerFoot_R","attach_pvt_innerFoot_R","attach_pvt_heel_L","attach_pvt_toe_L","attach_pvt_outerFoot_L","attach_pvt_innerFoot_L"]},IGNORE:{control:["righteye","lefteye","eyes","CloseLidUp","CloseLidLo"]},"Cherub Wings":{"Right Wing":{groupColor:"200 64 64 255",control:["R_wing_base_joint","R_wing_mid_joint","R_wing_end_joint","R_wing_tip_joint","R_wing_lower_joint"]},"Left Wing":{groupColor:"64 200 64 255",control:["L_wing_base_joint","L_wing_mid_joint","L_wing_end_joint","L_wing_tip_joint","L_wing_lower_joint"]}},"Cherub Deformers":{control:["head_tip_joint","headStar_joint1","headStar_joint2","headStar_joint3","headStar_joint4","headStar_joint5","headStar_joint6","headStar_joint7","headStar_joint8","upStar_joint1","upStar_joint2","upStar_joint3","upStar_joint4","upStar_joint5","upStar_joint6","upStar_joint7","upStar_joint8","midStar_joint1","midStar_joint2","midStar_joint3","midStar_joint4","midStar_joint5","midStar_joint6","midStar_joint7","midStar_joint8","lowerStar_joint1","lowerStar_joint2","lowerStar_joint3","lowerStar_joint4","lowerStar_joint5","lowerStar_joint6","lowerStar_joint7","lowerStar_joint8"]}};var SFM_DEFAULT_ANIMATION_GROUPS_URL = {groupFile:groupFile};

const FATTRIB_DONTSAVE = (1 << 6); // Don't persist to .dmx file
const FATTRIB_TOPOLOGICAL = (1 << 10); // Indicates this attribute effects the scene's topology (ie it's an attribute name or element)

const DMATTRIBUTE_HANDLE_INVALID$1 = -1;
//export type CDmxAttributeValue = null | undefined | boolean | number | CDmxElement | ParticleColor | vec2 | vec3 | vec4 | string;
class DmAttribute {
    owner;
    name;
    type;
    value = null;
    m_Handle = DMATTRIBUTE_HANDLE_INVALID$1;
    next = null;
    m_nFlags;
    static s_pAttrInfo = []; //TODO: fix this shit
    constructor(owner, type, name) {
        this.owner = owner;
        this.name = name;
        this.type = type;
        this.m_nFlags = 0;
        if (type >= DmAttributeTypeFirstArray) {
            this.value = [];
        }
        switch (type) {
            case DmAttributeType.Element:
            case DmAttributeType.ElementArray:
            case DmAttributeType.ObjectId:
            case DmAttributeType.ObjectIdArray:
                this.m_nFlags |= FATTRIB_TOPOLOGICAL;
                break;
        }
    }
    static createAttribute(owner, type, name) {
        switch (type) {
            case DmAttributeType.Unknown:
                return null;
            default:
                return new DmAttribute(owner, type, name);
        }
    }
    setNextAttribute(attribute) {
        this.next = attribute;
    }
    getNextAttribute() {
        return this.next;
    }
    checkCyclicRedundancy(other) {
        let current = this;
        do {
            if (current == other) {
                return true;
            }
            current = current.next;
        } while (current);
        return false;
    }
    findAttribute(attributeName) {
        let current = this;
        do {
            if (current.name == attributeName) { //TODO:GetNameSymbol
                return current;
            }
            current = current.next;
        } while (current);
        return null;
    }
    nextAttribute() {
        return this.next;
    }
    isFlagSet(flags) {
        return (flags & this.m_nFlags) ? true : false;
    }
    setValue(value) {
        if (this.type < DmAttributeTypeFirstArray) {
            /* TODO check value / type*/
            this.value = value;
        }
    }
    getValue() {
        return this.value;
    }
    pushValue(value) {
        //TODO: check value type ?
        if (this.type < DmAttributeTypeFirstArray) {
            console.error('Trying to push value in non array attribute');
        }
        this.value.push(value);
    }
    serialize(buf) {
        /*switch (this.type) {
            case DmAttributeType.String:
                buf.putDelimitedString(this.getValue());
                return buf.isValid();
            case DmAttributeType.Float:
            case DmAttributeType.Int:
                var v = this.getValue() || 0;
                buf.putString(v.toString());
                return buf.isValid();
            case DmAttributeType.Bool:
                buf.putString(this.getValue() ? '1' : '0');
                return buf.isValid();
            case DmAttributeType.Vector3:
                var v = this.getValue() || vec3.create();
                buf.putString(v[0] + ' ' + v[1] + ' ' + v[2]);
                return buf.isValid();
            case DmAttributeType.Quaternion:
                console.error(this.getValue());
                var q = this.getValue() || quat.create();
                buf.putString(q[0] + ' ' + q[1] + ' ' + q[2] + ' ' + q[3]);
                return buf.isValid();
            case DmAttributeType.Color:
                var q = this.getValue() || vec4.create();
                buf.putString(q[0] + ' ' + q[1] + ' ' + q[2] + ' ' + (q[3] || 0 ));
                return buf.isValid();
            case DmAttributeType.Time:
                buf.putString(this.getValue().toFixed(4));
                return buf.isValid();
            default:
                console.error('serialize not coded for type ' + this.type);
                //TODO;
        }
        */
        const value = this.getValue();
        if (value) {
            this.#serialize(value, buf);
        }
    }
    serializeIndex(index, buf) {
        if (this.type < DmAttributeTypeFirstArray) {
            return;
        }
        const value = this.getValue()?.[index];
        if (value) {
            this.#serialize(value, buf);
        }
    }
    #serialize(value, buf) {
        const type = this.type % (DmAttributeTypeFirstArray - 1);
        switch (type) {
            case DmAttributeType.String:
                buf.putDelimitedString(value);
                return buf.isValid();
            case DmAttributeType.Float:
            case DmAttributeType.Int:
                buf.putString(String(value));
                return buf.isValid();
            case DmAttributeType.Bool:
                buf.putString(value ? '1' : '0');
                return buf.isValid();
            case DmAttributeType.Vector2:
                buf.putString(value[0] + ' ' + value[1]);
                return buf.isValid();
            case DmAttributeType.Vector3:
                buf.putString(value[0] + ' ' + value[1] + ' ' + value[2]);
                return buf.isValid();
            case DmAttributeType.Quaternion:
                quat.normalize(value, value);
                buf.putString(value[0] + ' ' + value[1] + ' ' + value[2] + ' ' + value[3]);
                return buf.isValid();
            case DmAttributeType.Color:
                buf.putString(value[0] + ' ' + value[1] + ' ' + value[2] + ' ' + (value[3] ?? 0));
                return buf.isValid();
            case DmAttributeType.Time:
                buf.putString(value.toFixed(4));
                return buf.isValid();
        }
        return false;
    }
    serializesOnMultipleLines() {
        return false;
        //TODO
    }
}
//static CDmAttribute *CreateAttribute( CDmElement *pOwner, DmAttributeType_t type, const char *pAttributeName );
//static CDmAttribute *CreateExternalAttribute( CDmElement *pOwner, DmAttributeType_t type, const char *pAttributeName, void *pExternalMemory );
//static void DestroyAttribute( CDmAttribute *pAttribute );
/**
 * Check if other is already in the chain
 * TODO
 */
//DmAttribute.s_pAttrInfo = DmAttribute.s_pAttrInfo ?? [];//TODO: fix this shit
function AttributeTypeName(type) {
    if ((type >= DmAttributeType.Unknown) && (type <= DmAttributeTypeLastArray)) {
        return DmAttribute.s_pAttrInfo[type].getAttributeTypeName();
    }
    return 'unknown';
}
/*
function AttributeType(pName) {
    for (var i = 0; i < AT_TYPE_COUNT; ++i) {
        if (!Q_stricmp(DmAttribute.s_pAttrInfo[i].getAttributeType(), pName))
            return i;
    }

    return DmAttributeType.Unknown;
}

function Q_stricmp(str1, str2) {
    var s1 = str1.toLowerCase();
    var s2 = str2.toLowerCase();
    return ((s1 == s2) ? 0 : ((s1 > s2) ? 1 : -1));
}
*/

const DMATTRIBUTE_HANDLE_INVALID = -1; //TODO: put somewhere else
class DmAttributeList {
    m_hAttribute = DMATTRIBUTE_HANDLE_INVALID;
    m_pNext = null;
}

const DMELEMENT_HANDLE_INVALID$1 = -1;
class DmElementReference {
    elementHandle;
    m_nWeakHandleCount;
    m_nStrongHandleCount;
    m_attributes = new DmAttributeList();
    constructor(handle) {
        this.elementHandle = typeof handle === 'number' ? handle : DMELEMENT_HANDLE_INVALID$1;
        this.m_nWeakHandleCount = 0; // CDmeHandle<T> - for auto-hookup once the element comes back, mainly used by UI
        this.m_nStrongHandleCount = 0; // CDmeCountedElementRef - for preventing elements from being truly deleted, mainly used by undo and file root
        //		this.m_attributes = new DmAttributeList()//DmAttributeList_t m_attributes;
    }
}
/*
DmElementReference.prototype.addAttribute = function (attribute) {
    if (attribute instanceof DmAttribute) {
        if (this.m_attributes.m_hAttribute != DMATTRIBUTE_HANDLE_INVALID) {
            var pLink = new DmAttributeList(); // TODO - create a fixed size allocator for these
            pLink.m_hAttribute = this.m_attributes.m_hAttribute;
            pLink.m_pNext = this.m_attributes.m_pNext;
            this.m_attributes.m_pNext = pLink;
        }
        this.m_attributes.m_hAttribute = attribute.getHandle();
    } else {
        //TODO
        return false;
    }
    return true;
};

DmElementReference.prototype.removeAttribute = function (attribute) {
    if (attribute instanceof DmAttribute) {
        var hAttribute = pAttribute.getHandle();
        if (this.m_attributes.m_hAttribute == hAttribute) {
            var pNext = this.m_attributes.m_pNext;
            if (pNext) {
                this.m_attributes.m_hAttribute = pNext.m_hAttribute;
                this.m_attributes.m_pNext = pNext.m_pNext;
                //delete pNext;
            } else {
                this.m_attributes.m_hAttribute = DMATTRIBUTE_HANDLE_INVALID;
            }
            return true;
        }

        for (var pLink = this.m_attributes; pLink.m_pNext; pLink = pLink.m_pNext) {
            var pNext = pLink.m_pNext;
            if (pNext.m_hAttribute == hAttribute) {
                pLink.m_pNext = pNext.m_pNext;
                //delete pNext; // TODO - create a fixed size allocator for these
                return true;
            }
        }
    } else {
        //TODO
        return false;
    }
    return true;
};
*/

function DECLARE_ATTRIBUTE_TYPE(_className, _attributeType, _attributeName, _defaultSetStatement) {
    DECLARE_ATTRIBUTE_TYPE_INTERNAL(_className, _className, _attributeType, _attributeName, _defaultSetStatement);
}
function DECLARE_ATTRIBUTE_ARRAY_TYPE(_className, _attributeType, _attributeName) {
    DECLARE_ATTRIBUTE_TYPE_INTERNAL(_className, _className, _attributeType, _attributeName);
}
//DmAttribute.s_pAttrInfo = DmAttribute.s_pAttrInfo ?? [];//TODO: fix this shit
function DECLARE_ATTRIBUTE_TYPE_INTERNAL(_className, _storageType, _attributeType, _attributeName, _defaultSetStatement) {
    const t = new DmAttributeInfo(_className, _storageType, _attributeType, _attributeName, _defaultSetStatement);
    DmAttribute.s_pAttrInfo[_attributeType] = t;
}
function DECLARE_ATTRIBUTE_ARRAY_TYPE_INTERNAL(_className, _storageType, _attributeType, _attributeName) {
    const t = new DmAttributeInfo(_className, _storageType, _attributeType, _attributeName);
    DmAttribute.s_pAttrInfo[_attributeType] = t;
}
class DmAttributeInfo {
    attributeType;
    attributeName;
    defaultSetStatement;
    constructor(_className, _storageType, _attributeType, _attributeName, _defaultSetStatement) {
        this.attributeType = _attributeType;
        this.attributeName = _attributeName;
        this.defaultSetStatement = _defaultSetStatement;
    }
    getAttributeType() {
        return this.attributeType;
    }
    getAttributeTypeName() {
        return this.attributeName;
    }
}
DECLARE_ATTRIBUTE_TYPE('int', DmAttributeType.Int, 'int', 'value = 0;');
DECLARE_ATTRIBUTE_TYPE('float', DmAttributeType.Float, 'float', 'value = 0.0f;');
DECLARE_ATTRIBUTE_TYPE('bool', DmAttributeType.Bool, 'bool', 'value = false;');
DECLARE_ATTRIBUTE_TYPE('Color', DmAttributeType.Color, 'color', 'value.SetColor( 0, 0, 0, 255 );');
DECLARE_ATTRIBUTE_TYPE('Vector2D', DmAttributeType.Vector2, 'vector2', 'value.Init( 0.0f, 0.0f );');
DECLARE_ATTRIBUTE_TYPE('Vector', DmAttributeType.Vector3, 'vector3', 'value.Init( 0.0f, 0.0f, 0.0f );');
DECLARE_ATTRIBUTE_TYPE('Vector4D', DmAttributeType.Vector4, 'vector4', 'value.Init( 0.0f, 0.0f, 0.0f, 0.0f );');
DECLARE_ATTRIBUTE_TYPE('QAngle', DmAttributeType.QAngle, 'qangle', 'value.Init( 0.0f, 0.0f, 0.0f );');
DECLARE_ATTRIBUTE_TYPE('Quaternion', DmAttributeType.Quaternion, 'quaternion', 'value.Init( 0.0f, 0.0f, 0.0f, 1.0f );');
DECLARE_ATTRIBUTE_TYPE('VMatrix', DmAttributeType.VMatrix, 'matrix', 'MatrixSetIdentity( value );');
DECLARE_ATTRIBUTE_TYPE('CUtlString', DmAttributeType.String, 'string', 'value.Set( NULL );');
DECLARE_ATTRIBUTE_TYPE('CUtlBinaryBlock', DmAttributeType.Void, 'binary', 'value.Set( NULL, 0 );');
//DECLARE_ATTRIBUTE_TYPE('DmObjectId_t',			DmAttributeType.ObjectId,			'elementid',	'InvalidateUniqueId( &value );' );
DECLARE_ATTRIBUTE_TYPE('DmObjectId_t', DmAttributeType.ObjectId, 'time', 'InvalidateUniqueId( &value );');
DECLARE_ATTRIBUTE_TYPE_INTERNAL('DmElementHandle_t', 'DmElementAttribute_t', DmAttributeType.Element, 'element', 'value = DMELEMENT_HANDLE_INVALID;');
DECLARE_ATTRIBUTE_ARRAY_TYPE('int', DmAttributeType.IntArray, 'int_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('float', DmAttributeType.FloatArray, 'float_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('bool', DmAttributeType.BoolArray, 'bool_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('Color', DmAttributeType.ColorArray, 'color_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('Vector2D', DmAttributeType.Vector2Array, 'vector2_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('Vector', DmAttributeType.Vector3Array, 'vector3_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('Vector4D', DmAttributeType.Vector4Array, 'vector4_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('QAngle', DmAttributeType.QAngleArray, 'qangle_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('Quaternion', DmAttributeType.QuaternionArray, 'quaternion_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('VMatrix', DmAttributeType.VMatrixArray, 'matrix_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('CUtlString', DmAttributeType.StringArray, 'string_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE('CUtlBinaryBlock', DmAttributeType.VoidArray, 'binary_array');
//DECLARE_ATTRIBUTE_ARRAY_TYPE('DmObjectId_t',		DmAttributeType.ObjectIdArray,		'elementid_array' )
DECLARE_ATTRIBUTE_ARRAY_TYPE('DmObjectId_t', DmAttributeType.ObjectIdArray, 'time_array');
DECLARE_ATTRIBUTE_ARRAY_TYPE_INTERNAL('DmElementHandle_t', 'DmElementArray_t', DmAttributeType.ElementArray, 'element_array');

/**
 *
 */
/*
CDmElement::CDmElement( DmElementHandle_t handle, const char *pElementType, const DmObjectId_t &id, const char *pElementName, DmFileId_t fileid ) :
    m_ref( handle ), m_Type( g_pDataModel->GetSymbol( pElementType ) ), m_fileId( fileid ),
    m_pAttributes( NULL ), m_bDirty( false ), m_bBeingUnserialized( false ), m_bIsAcessible( true )
*/
const DMELEMENT_HANDLE_INVALID = -1;
class DmElement {
    isDmElement = true;
    m_pAttributes = null;
    m_ref;
    m_Type;
    #m_bDirty = false;
    m_bBeingUnserialized = false;
    m_bIsAcessible = true;
    m_Id;
    m_fileId;
    constructor(handle, pElementType, id, pElementName, fileid) {
        this.m_ref = new DmElementReference(handle);
        this.m_Type = pElementType; //DataModel.GetSymbol(pElementType);//TODO
        this.m_Id = id;
        this.m_fileId = fileid;
        this.createAttribute('name', DmAttributeType.String, pElementName);
    }
    //CDmAttribute *CDmElement::CreateAttribute( const char *pAttributeName, DmAttributeType_t type )
    createAttribute(attributeName, attributeType, attributeValue) {
        if (this.hasAttribute(attributeName, attributeType)) {
            const attribute = this.findAttribute(attributeName);
            if (attribute && attributeValue !== undefined) {
                attribute.setValue(attributeValue);
            }
            //TODO
            return null;
        }
        this.markDirty();
        const attribute = DmAttribute.createAttribute(this, attributeType, attributeName);
        if (!attribute) {
            return null;
        }
        attribute.setNextAttribute(this.m_pAttributes);
        this.m_pAttributes = attribute;
        if (attributeValue !== undefined) {
            if (attributeType < DmAttributeTypeFirstArray) {
                /* TODO check value / type*/
                attribute.setValue(attributeValue);
            }
            else {
                for (const value of attributeValue) {
                    attribute.pushValue(value);
                }
            }
        }
        //g_pDataModelImp->NotifyState( NOTIFY_CHANGE_TOPOLOGICAL );
        return attribute;
    }
    hasAttribute(attributeName, attributeType) {
        //attributeType = typeof attributeType !== 'undefined' ? attributeType : DmAttributeType.Unknown;
        const attribute = this.findAttribute(attributeName);
        if (!attribute) {
            return false;
        }
        return (attributeType == DmAttributeType.Unknown || (attribute.type == attributeType));
    }
    findAttribute(attributeName) {
        if (this.m_pAttributes) {
            return this.m_pAttributes.findAttribute(attributeName);
        }
        return null;
        //UtlSymId_t find = g_pDataModel->GetSymbol( pAttributeName );TODO
        /*for ( CDmAttribute *pAttr = m_pAttributes; pAttr; pAttr = pAttr->NextAttribute() )
        {
            if ( find == pAttr->GetNameSymbol() )
                return pAttr;
        }

        return NULL;*/
    }
    setAttributeValue(attributeName, value) {
        if (this.m_pAttributes) {
            const attribute = this.m_pAttributes.findAttribute(attributeName);
            if (attribute) {
                attribute.setValue(value);
            }
        }
    }
    markDirty() {
        //dirty = typeof dirty !== 'undefined' ? dirty : true;
        this.#m_bDirty = true;
        /*{
            if ( bDirty && !m_bDirty )
            {
                g_pDmElementFrameworkImp->AddElementToDirtyList( m_ref.m_hElement );
            }
            m_bDirty = bDirty;
        }*/
    }
    getHandle() {
        if (this.m_ref.elementHandle == DMELEMENT_HANDLE_INVALID) {
            console.error('Invalid handle');
            //TODO
        }
        return this.m_ref.elementHandle;
    }
    getId() {
        return this.m_Id;
    }
    firstAttribute() {
        return this.m_pAttributes;
    }
    getTypeString() {
        return this.m_Type; //DataModel.getString( m_Type );TODO
    }
}
/*
DmElement.prototype.addAttributeByPtr = function (attribute) {
    if (attribute instanceof DmAttribute) {
        this.markDirty();

        if (this.m_pAttributes && this.m_pAttributes.checkCyclicRedundancy(attribute)) {
            return false;
        }

        attribute.setNextAttribute(this.m_pAttributes);
        this.m_pAttributes = attribute;

        //g_pDataModelImp->NotifyState( NOTIFY_CHANGE_TOPOLOGICAL );
    } else {
        //TODO
        return false;
    }
    return true;
};
*/

class UniqueId {
    value;
    createUniqueId() {
        this.value = generateUUID();
    }
    Serialize(buf) {
        if (buf.isText()) {
            if (this.value != undefined) {
                buf.putString(this.value);
            }
            else {
                buf.putChar('\0');
            }
        }
        return buf.isValid();
    }
}
function generateUUID() {
    let d = Date.now();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const UNNAMED_ELEMENT_NAME = 'unnamed';
class DataModel {
    static m_Handles = 0;
    static GetAttributeNameForType(attType /*TODO: improve type*/) {
        return AttributeTypeName(attType);
    }
    /*
    var GetAttributeTypeForName (name) {
        return AttributeType(name);
    }
    */
    static acquireElementHandle() {
        return ++this.m_Handles;
    }
    //CDmElement* CDataModel::CreateElement( const DmElementReference_t &ref, const char *pElementType, const char *pElementName, DmFileId_t fileid, const DmObjectId_t *pObjectID )
    static createElement(ref, pElementType, pElementName, fileid, pObjectID) {
        if (!pObjectID) {
            pObjectID = new UniqueId();
            pObjectID.createUniqueId();
        }
        if (!pElementName) {
            pElementName = UNNAMED_ELEMENT_NAME;
        }
        //handle, pElementType, id, pElementName, fileid
        const element = new DmElement(this.acquireElementHandle(), pElementType, pObjectID, pElementName, fileid);
        return element;
    }
    static createElementNew(pElementType, pElementName) {
        const pObjectID = new UniqueId();
        pObjectID.createUniqueId();
        if (!pElementName) {
            pElementName = UNNAMED_ELEMENT_NAME;
        }
        //handle, pElementType, id, pElementName, fileid
        const element = new DmElement(this.acquireElementHandle(), pElementType, pObjectID, pElementName);
        return element;
    }
}

const ELEMENT_DICT_HANDLE_INVALID = -1;
class ElementInfo {
    m_bRoot = false;
    m_pElement;
}
class DmElementSerializationDictionary {
    root = null;
    element = null;
    m_Dict = {};
    m_Dict2 = [];
    //void BuildElementList( CDmElement *pRoot, bool bFlatMode );
    buildElementList(root, flatMode) {
        this.#buildElementList_R(root, flatMode, true);
    }
    // Should I inline the serialization of this element?
    //bool ShouldInlineElement( CDmElement *pElement );
    shouldInlineElement(element) {
        if (element) {
            const handle = element.getHandle();
            const info = this.m_Dict[handle];
            if (info) {
                return !info.m_bRoot;
            }
        }
        //console.error('fixme');
        return false;
    }
    // Clears the dictionary
    clear() {
        //TODO
        console.error('fixme');
    }
    // Iterates over all root elements to serialize
    //DmElementDictHandle_t FirstRootElement() const;
    firstRootElement() {
        const nCount = this.m_Dict2.length;
        for (let h = 0; h < nCount; h++) {
            if (this.m_Dict[this.m_Dict2[h]]?.m_bRoot) {
                return h;
            }
        }
        return ELEMENT_DICT_HANDLE_INVALID;
    }
    //DmElementDictHandle_t NextRootElement( DmElementDictHandle_t h ) const;
    nextRootElement(h) {
        ++h;
        const nCount = this.m_Dict2.length;
        for (; h < nCount; h++) {
            if (this.m_Dict[this.m_Dict2[h]]?.m_bRoot) {
                return h;
            }
        }
        return ELEMENT_DICT_HANDLE_INVALID;
    }
    //CDmElement* GetRootElement( DmElementDictHandle_t h );
    getRootElement(h) {
        return this.m_Dict[this.m_Dict2[h]]?.m_pElement ?? null;
    }
    // Finds the handle of the element
    //DmElementDictHandle_t Find( CDmElement *pElement );
    find( /*pElement: DmElement*/) {
        console.error('fixme');
        //TODO
    }
    // How many root elements do we have?
    //int RootElementCount() const;
    rootElementCount() {
        console.error('fixme');
        //TODO
    }
    addElement(element, isRoot) {
        const handle = element.getHandle();
        const info = new ElementInfo();
        info.m_bRoot = isRoot;
        info.m_pElement = element;
        this.m_Dict[handle] = info;
        this.m_Dict2.push(handle);
    }
    //void BuildElementList_R( CDmElement *pElement, bool bFlatMode, bool bIsRoot );
    #buildElementList_R(pElement, bFlatMode, bIsRoot) {
        if (!pElement) {
            return;
        }
        //console.error('fixme');
        const handle = pElement.getHandle();
        const h = this.m_Dict[handle];
        if (h) {
            h.m_bRoot = true;
            return;
        }
        //var info = new ElementInfo();
        //info.m_bRoot = bFlatMode || bIsRoot;
        //info.m_pElement = pElement;
        //m_Dict[handle] = info;//m_Dict.Insert( info );
        this.addElement(pElement, bFlatMode || bIsRoot);
        for (let pAttribute = pElement.firstAttribute(); pAttribute; pAttribute = pAttribute.nextAttribute()) {
            if (pAttribute.isFlagSet(FATTRIB_DONTSAVE)) {
                continue;
            }
            switch (pAttribute.type) {
                case DmAttributeType.Element:
                    {
                        const pChild = pAttribute.getValue();
                        /*if ( !pChild || pChild.GetFileId() != pElement.GetFileId()) {TODO
                            break;
                        }*/
                        this.#buildElementList_R(pChild, bFlatMode, false);
                    }
                    break;
                case DmAttributeType.ElementArray:
                    {
                        const array = pAttribute.getValue();
                        if (array instanceof Array) {
                            const nCount = array.length;
                            for (let i = 0; i < nCount; ++i) {
                                const pChild = array[i];
                                /*if (!pChild || pChild.GetFileId() != pElement.GetFileId()) {TODO
                                    break;
                                }*/
                                this.#buildElementList_R(pChild, bFlatMode, false);
                            }
                        }
                    }
                    break;
            }
        }
    }
}

const conversionArray = {
    '\n': 'n',
    '\t': 't',
    '\v': 'v',
    '\b': 'b',
    '\r': 'r',
    '\f': 'f',
    //'\a' : 'a',
    '\\': '\\',
    '\?': '\?',
    '\'': '\'',
    '\"': '\"'
};
class UtlBuffer {
    //var TEXT_BUFFER = 0x1;			// Describes how get + put work (as strings, or binary)
    //var EXTERNAL_GROWABLE = 0x2;	// This is used w/ external buffers and causes the utlbuf to switch to reallocatable memory if an overflow happens when Putting.
    //var CONTAINS_CRLF = 0x4;		// For text buffers only, does this contain \n or \n\r?
    //var READ_ONLY = 0x8;			// For external buffers; prevents null termination from happening.
    //var AUTO_TABS_DISABLED = 0x10;	// Used to disable/enable push/pop tabs
    #m_Error = 0;
    #m_Flags;
    #m_nTab = 0;
    #buffer = [];
    constructor(flags) {
        this.#m_Flags = flags;
    }
    isText() {
        return (this.#m_Flags & BufferFlags.TEXT_BUFFER) != 0;
    }
    pushTab() {
        ++this.#m_nTab;
    }
    popTab() {
        if (--this.#m_nTab < 0) {
            this.#m_nTab = 0;
        }
    }
    #wasLastCharacterCR() {
        if (!this.isText()) {
            return false;
        }
        const lastString = this.#buffer[this.#buffer.length - 1];
        return (lastString.substring(lastString.length - 1) == '\n');
    }
    #putTabs() {
        const nTabCount = (this.#m_Flags & BufferFlags.AUTO_TABS_DISABLED) ? 0 : this.#m_nTab;
        for (let i = nTabCount; --i >= 0;) {
            this.#putTypeBinChar('\t');
        }
    }
    #bufferPush(c) {
        if (c.length) {
            this.#buffer.push(c);
        }
    }
    #putTypeBinChar(c) {
        this.#bufferPush(c);
    }
    putChar(c) {
        if (this.#wasLastCharacterCR()) {
            this.#putTabs();
        }
        this.#bufferPush(c);
    }
    #put(s, size) {
        this.#bufferPush(s.substring(0, size));
    }
    putString(s) {
        if (!this.isText()) {
            if (s) {
                this.#bufferPush(s);
            }
            else {
                this.#bufferPush('\0');
            }
        }
        else {
            const nTabCount = (this.#m_Flags & BufferFlags.AUTO_TABS_DISABLED) ? 0 : this.#m_nTab;
            if (nTabCount > 0) {
                if (this.#wasLastCharacterCR()) {
                    this.#putTabs();
                }
                //const char* pEndl = strchr( string, '\n' );
                let pEndl = s.indexOf('\n');
                while (pEndl != -1) {
                    const nSize = pEndl + 1; //(size_t)pEndl - (size_t)string + sizeof(char);
                    this.#put(s, nSize);
                    s = s.substring(pEndl + 1);
                    if (s.length) {
                        this.#putTabs();
                        pEndl = s.indexOf('\n');
                    }
                    else {
                        pEndl = -1;
                    }
                }
            }
            this.#bufferPush(s);
        }
    }
    #putDelimitedCharInternal(c) {
        const l = conversionArray[c]; //pConv->GetConversionLength( c );
        if (!l) {
            this.putChar(c);
        }
        else {
            this.putChar('\\' /* pConv->GetEscapeChar() */);
            this.#put(l, 1);
        }
    }
    putDelimitedString(s) {
        if (typeof s != 'string') {
            s = '';
        }
        if (!this.isText()) {
            this.putString(s);
            return;
        }
        if (this.#wasLastCharacterCR()) {
            this.#putTabs();
        }
        this.#put('\"', 1); //Put( pConv->GetDelimiter(), pConv->GetDelimiterLength() );
        const nLen = s.length; //? Q_strlen( string ) : 0;
        for (let i = 0; i < nLen; ++i) {
            this.#putDelimitedCharInternal(s[i]);
        }
        if (this.#wasLastCharacterCR()) {
            this.#putTabs();
        }
        this.#put('\"', 1); //Put( pConv->GetDelimiter(), pConv->GetDelimiterLength() );
    }
    isValid() {
        return this.#m_Error == 0;
    }
    getBuffer() {
        return this.#buffer.join('');
    }
}
var SeekType;
(function (SeekType) {
    SeekType[SeekType["SEEK_HEAD"] = 0] = "SEEK_HEAD";
    SeekType[SeekType["SEEK_CURRENT"] = 1] = "SEEK_CURRENT";
    SeekType[SeekType["SEEK_TAIL"] = 2] = "SEEK_TAIL";
})(SeekType || (SeekType = {}));
var BufferFlags;
(function (BufferFlags) {
    BufferFlags[BufferFlags["TEXT_BUFFER"] = 1] = "TEXT_BUFFER";
    BufferFlags[BufferFlags["EXTERNAL_GROWABLE"] = 2] = "EXTERNAL_GROWABLE";
    BufferFlags[BufferFlags["CONTAINS_CRLF"] = 4] = "CONTAINS_CRLF";
    BufferFlags[BufferFlags["READ_ONLY"] = 8] = "READ_ONLY";
    BufferFlags[BufferFlags["AUTO_TABS_DISABLED"] = 16] = "AUTO_TABS_DISABLED";
})(BufferFlags || (BufferFlags = {}));

function Serialize(buf, src) {
    if (buf instanceof UtlBuffer) {
        switch (true) {
            case src instanceof UniqueId:
                src.Serialize(buf);
                break;
            //TODO
            default:
                console.error('Serialization of this type not impemented', src);
        }
    }
    else {
        console.error('buffer not instance of UtlBuffer');
    }
}
/*
{
// X360TBD: Need a real UUID Implementation
#ifdef IS_WINDOWS_PC
    if ( buf.IsText() )
    {
        UUID *pId = ( UUID * )&src;

        unsigned char *outstring = NULL;

        UuidToString( pId, &outstring );
        if ( outstring && *outstring )
        {
            buf.PutString( (const char *)outstring );
            RpcStringFree( &outstring );
        }
        else
        {
            buf.PutChar( '\0' );
        }
    }
    else
    {
        buf.Put( &src, sizeof(UniqueId_t) );
    }
    return buf.IsValid();
#else
    return false;
#endif
*/

/*
const TOKEN_INVALID = -1;			// A bogus token
const TOKEN_OPEN_BRACE = 0;		// {
const TOKEN_CLOSE_BRACE = 1;		// }
const TOKEN_OPEN_BRACKET = 2;		// [
const TOKEN_CLOSE_BRACKET = 3;	// ]
const TOKEN_COMMA = 4;			// ,
//		TOKEN_STRING,				// Any non-quoted string
const TOKEN_DELIMITED_STRING = 5;	// Any quoted string
const TOKEN_INCLUDE = 6;			// #include
const TOKEN_EOF = 7;				// End of buffer
*/
class DmSerializerKeyValues2 {
    #flatMode;
    constructor(flatmode) {
        this.#flatMode = flatmode;
    }
    /*TODO
    CDmElementDictionary m_ElementDict;
    DmElementDictHandle_t m_hRoot;
    bool m_bFlatMode;
    DmConflictResolution_t m_idConflictResolution;
    DmFileId_t m_fileid;*/
    //enum TokenType_t
    getName() {
        return this.#flatMode ? 'keyvalues2_flat' : 'keyvalues2';
    }
    getDescription() {
        return this.#flatMode ? 'KeyValues2 (flat)' : 'KeyValues2';
    }
    storesVersionInFile() {
        return true;
    }
    isBinaryFormat() {
        return false;
    }
    getCurrentVersion() {
        return 1;
    }
    serialize(outBuf, root) {
        //SetSerializationDelimiter(GetCStringCharConversion());
        //SetSerializationArrayDelimiter(',');TODO
        outBuf.putString('<!-- dmx encoding keyvalues2 1 format sfm_session 20 -->\n');
        // Save elements, attribute links
        const dict = new DmElementSerializationDictionary();
        dict.buildElementList(root, this.#flatMode);
        // Save elements to buffer
        for (let i = dict.firstRootElement(); i != ELEMENT_DICT_HANDLE_INVALID; i = dict.nextRootElement(i)) {
            this.saveElement(outBuf, dict, dict.getRootElement(i));
            outBuf.putChar('\n');
        }
        return true;
    }
    //bool CDmSerializerKeyValues2::SaveElement( CUtlBuffer& buf, CDmElementSerializationDictionary &dict, CDmElement *pElement, bool bWriteDelimiters )
    saveElement(buf, dict, pElement, bWriteDelimiters = true) {
        if (!pElement) {
            return false;
        }
        if (bWriteDelimiters) {
            buf.putString('\"' + pElement.getTypeString() + '\"\n{\n');
        }
        buf.pushTab();
        // explicitly serialize id, now that it's no longer an attribute
        //buf.Printf('\"id\" \"%s\" ', DataModel.GetAttributeNameForType(DmAttributeType.ObjectId));
        //buf.putString('\"id\" \"' + DataModel.GetAttributeNameForType(DmAttributeType.ObjectId) + '\" ');
        buf.putString('\"id\" \"elementid\" ');
        buf.putChar('\"');
        Serialize(buf, pElement.getId());
        buf.putString('\"\n');
        this.serializeAttributes(buf, dict, pElement);
        //TODO
        buf.popTab();
        if (bWriteDelimiters) {
            buf.putString('}\n');
        }
        return true;
    }
    serializeAttributes(buf, dict, pElement) {
        const attributes = [];
        for (let pAttribute = pElement.firstAttribute(); pAttribute; pAttribute = pAttribute.nextAttribute()) {
            if (pAttribute.isFlagSet(FATTRIB_DONTSAVE)) {
                continue;
            }
            attributes.push(pAttribute);
        }
        // Now write them all out in reverse order, since FirstAttribute is actually the *last* attribute for perf reasons
        for (let i = attributes.length - 1; i >= 0; --i) {
            const pAttribute = attributes[i];
            const pName = pAttribute.name;
            const nAttrType = pAttribute.type;
            if (nAttrType != DmAttributeType.Element) {
                buf.putString('\"' + pName + '\" \"' + DataModel.GetAttributeNameForType(nAttrType) + '\" ');
            }
            else {
                // Elements either serialize their type name or 'element' depending on whether they are inlined
                buf.putString('\"' + pName + '\" ');
            }
            switch (nAttrType) {
                default:
                    if (nAttrType >= DmAttributeTypeFirstArray) {
                        this.serializeArrayAttribute(buf, pAttribute);
                        //TODO
                        //console.error('if ( nAttrType >= AT_FIRST_ARRAY_TYPE )');
                    }
                    else {
                        if (pAttribute.serializesOnMultipleLines()) {
                            buf.putChar('\n');
                        }
                        buf.putChar('\"');
                        buf.pushTab();
                        pAttribute.serialize(buf);
                        buf.popTab();
                        buf.putChar('\"');
                        //TODO
                        //console.error('if ( nAttrType >= AT_FIRST_ARRAY_TYPE )');
                    }
                    break;
                case DmAttributeType.String:
                    // Don't explicitly add string delimiters; serialization does that.
                    pAttribute.serialize(buf);
                    break;
                case DmAttributeType.Element:
                    this.#serializeElementAttribute(buf, dict, pAttribute);
                    break;
                case DmAttributeType.ElementArray:
                    this.#serializeElementArrayAttribute(buf, dict, pAttribute);
                    //console.error('SerializeElementArrayAttribute( buf, dict, pAttribute );');TODO REMOVE me
                    break;
            }
            buf.putChar('\n');
        }
        return true;
    }
    #serializeElementAttribute(buf, dict, pAttribute) {
        const pElement = pAttribute.getValue();
        if (pElement && dict.shouldInlineElement(pElement)) {
            buf.putString('\"' + pElement.getTypeString() + '\"\n{\n');
            if (pElement) {
                this.saveElement(buf, dict, pElement, false);
            }
            buf.putString('}\n');
        }
        else {
            buf.putString('\"' + DataModel.GetAttributeNameForType(DmAttributeType.Element) + '\" \"');
            if (pElement) {
                Serialize(buf, pElement.getId());
            }
            buf.putChar('\"');
        }
    }
    #serializeElementArrayAttribute(buf, dict, pAttribute) {
        const array = pAttribute.getValue();
        buf.putString('\n[\n');
        buf.pushTab();
        const nCount = (array instanceof Array) ? array.length : 0;
        for (let i = 0; i < nCount; ++i) {
            const pElement = array[i];
            if (dict.shouldInlineElement(pElement)) {
                buf.putString('\"' + pElement.getTypeString() + '\"\n{\n');
                if (pElement) {
                    this.saveElement(buf, dict, pElement, false);
                }
                buf.putString('}');
            }
            else {
                //var pAttributeType = AttributeTypeName(DmAttributeType.Element);
                buf.putString('\"' + DataModel.GetAttributeNameForType(DmAttributeType.Element) + '\" \"');
                if (pElement) {
                    //::Serialize( buf, pElement->GetId() );
                    Serialize(buf, pElement.getId());
                }
                buf.putChar('\"');
            }
            if (i != nCount - 1) {
                buf.putChar(',');
            }
            buf.putChar('\n');
        }
        buf.popTab();
        buf.putChar(']');
    }
    serializeArrayAttribute(buf, pAttribute) {
        const array = pAttribute.getValue();
        buf.putString('\n[\n');
        buf.pushTab();
        const nCount = (array instanceof Array) ? array.length : 0;
        for (let i = 0; i < nCount; ++i) {
            if (pAttribute.type != DmAttributeType.StringArray) {
                buf.putChar('\"');
                buf.pushTab();
            }
            const attribute = array[i];
            //attribute.serialize(buf);
            if (pAttribute.type != DmAttributeType.StringArray) {
                //buf.putString(String(attribute));
                pAttribute.serializeIndex(i, buf);
            }
            else {
                buf.putDelimitedString(String(attribute));
            }
            //array.GetAttribute()->SerializeElement( i, buf );
            if (pAttribute.type != DmAttributeType.StringArray) {
                buf.popTab();
                buf.putChar('\"');
            }
            if (i != nCount - 1) {
                buf.putChar(',');
            }
            buf.putChar('\n');
        }
        buf.popTab();
        buf.putChar(']');
    }
}

var _a;
const CLIP_TYPE_CHANNEL = 0;
const CLIP_TYPE_AUDIO = 1;
//const CLIP_TYPE_EFFECTS = 2;
const CLIP_TYPE_FILM = 3;
//let createFilmClipId = 0;
const elementTemplates = {};
function LookAt(sourcePoint, destPoint, upVector) {
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
class SfmSession {
    #dmeSession = DataModel.createElement(undefined, 'DmElement');
    filmShot1;
    animSetEditorChannels;
    camerasDag;
    lightsDag;
    scene;
    overlayEffects;
    static defaultAnimationGroups;
    constructor(mapName = 'itemtest.bsp', clipName = 'SFM') {
        this.#populateSession(mapName, clipName);
    }
    #populateSession(mapName, clipName) {
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
        const cameras = this.createDmeDag('Cameras', this.#createDmeTransform(), [ /*camera*/]);
        this.camerasDag = cameras;
        this.scene = this.createDmeDag('scene', this.#createDmeTransform(), [cameras]);
        const soundDialog = this.createDmeTrack('Dialog', [], CLIP_TYPE_AUDIO);
        const soundMusic = this.createDmeTrack('Music', [], CLIP_TYPE_AUDIO);
        const soundEffects = this.createDmeTrack('Effects', [], CLIP_TYPE_AUDIO);
        this.overlayEffects = this.createDmeTrack('Effects', [], CLIP_TYPE_FILM);
        this.filmShot1 = this.#createFilmClip('shot1', [this.#createDmeTrackGroup('channelTrackGroup', [this.animSetEditorChannels])], undefined, undefined, this.scene, [ /*animSet*/], '');
        //this.mainCameraAnimSet = this.createAnimSetForCamera('camera1', camera);
        const subClipTrackGroupFilm = this.createDmeTrack('Film', [this.filmShot1], CLIP_TYPE_FILM);
        const activeClip = this.#createFilmClip(clipName, [
            this.#createDmeTrackGroup('Sound', [soundDialog, soundMusic, soundEffects]),
            this.#createDmeTrackGroup('Overlay', [this.overlayEffects]),
        ], this.#createDmeTrackGroup('subClipTrackGroup', [subClipTrackGroupFilm]), undefined, undefined, undefined, mapName);
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
    #createFilmClip(clipName, trackGroups = [], subClipTrackGroup, camera, scene, animationSets = [], mapname) {
        //animationSets = (animationSets instanceof Array) ? animationSets : [];
        //++createFilmClipId;
        const dmeFilmClip = DataModel.createElement(undefined, 'DmeFilmClip', clipName /*'test' + CreateFilmClip.clipId*/);
        dmeFilmClip.createAttribute('timeFrame', DmAttributeType.Element, this.#createDmeTimeFrame());
        dmeFilmClip.createAttribute('color', DmAttributeType.Color, vec4.fromValues(0, 0, 0, 0) /*'0 255 0 255'*/);
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
    out() {
        const buf = new UtlBuffer(BufferFlags.TEXT_BUFFER);
        new DmSerializerKeyValues2(false).serialize(buf, this.#dmeSession);
        return buf.getBuffer();
    }
    #createDmeTimeSelection(name) {
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
    createDmeTrack(trackName, children = [], clipType = 0) {
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
    createDmeCamera(cameraName, cameraPos, cameraLookAt, rollAngle) {
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
    createDmeGlobalFlexControllerOperator(name, flexWeight, gameModel) {
        const dmeGlobalFlexControllerOperator = DataModel.createElement(undefined, 'DmeGlobalFlexControllerOperator', name);
        dmeGlobalFlexControllerOperator.createAttribute('flexWeight', DmAttributeType.Float, flexWeight);
        dmeGlobalFlexControllerOperator.createAttribute('gameModel', DmAttributeType.Element, gameModel);
        return dmeGlobalFlexControllerOperator;
    }
    createDmeDag(name, transform, children = []) {
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
    #createDmeTransform(name, position = vec3.create(), orientation = quat.create(), scale) {
        const dmeTransform = DataModel.createElement(undefined, 'DmeTransform', name);
        dmeTransform.createAttribute('position', DmAttributeType.Vector3, position); //TODO
        dmeTransform.createAttribute('orientation', DmAttributeType.Quaternion, orientation); //TODO
        if (scale !== undefined) {
            dmeTransform.createAttribute('scale', DmAttributeType.Float, scale); //TODO
        }
        /*'position' 'vector3' '0 0 0'
        'orientation' 'quaternion' '0 0 0 1'*/
        //TODO
        return dmeTransform;
    }
    #createDmeChannel(name, fromElement, fromAttribute, fromIndex, toElement, toAttribute, toIndex, mode) {
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
    #getTypeName(type) {
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
    #createDmeTypedLog(type, name, times = [], values = []) {
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
    #createDmeTypedLayer(type /*TODO: improve type*/, name, times, values) {
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
    #createDmeChannelsClip(name, timeFrame, channels) {
        const dmeChannelsClip = DataModel.createElement(undefined, 'DmeChannelsClip', name);
        dmeChannelsClip.createAttribute('timeFrame', DmAttributeType.Element, timeFrame);
        dmeChannelsClip.createAttribute('color', DmAttributeType.Color, vec4.fromValues(0, 0, 0, 0) /*'0 0 0 1'*/); //TODO
        dmeChannelsClip.createAttribute('text', DmAttributeType.String, ''); //TODO
        dmeChannelsClip.createAttribute('mute', DmAttributeType.Bool, false); //TODO
        dmeChannelsClip.createAttribute('trackGroups', DmAttributeType.ElementArray, []); //TODO
        dmeChannelsClip.createAttribute('displayScale', DmAttributeType.Float, 1); //TODO
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
    #createDmeTrackGroup(trackGroupName, tracks) {
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
    #createDmeTimeFrame(name, startTime = 0, duration = 60, offset = 0, scale = 1) {
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
    #createDmeTransformControl(name, valuePosition = vec3.create(), valueOrientation = quat.create(), positionChannel, orientationChannel) {
        const dmeTransformControl = DataModel.createElement(undefined, 'DmeTransformControl', name);
        dmeTransformControl.createAttribute('valuePosition', DmAttributeType.Vector3, valuePosition); //TODO
        dmeTransformControl.createAttribute('valueOrientation', DmAttributeType.Quaternion, valueOrientation); //TODO
        dmeTransformControl.createAttribute('positionChannel', DmAttributeType.Element, positionChannel); //TODO
        dmeTransformControl.createAttribute('orientationChannel', DmAttributeType.Element, orientationChannel); //TODO
        /*
        'valuePosition' 'vector3' '0 0 0'
        'valueOrientation' 'quaternion' '0.4999978542 0.4999978542 0.4999978542 0.5000064373'
        'positionChannel' 'element' '7d1da3e1-7094-494c-a231-902b36c2a850'
        'orientationChannel' 'element' 'b8bff802-607a-46dc-9995-9c151e068f06'
        */
        return dmeTransformControl;
    }
    #createDmeScaleControl(name, valueScale, scaleChannel) {
        const dmeTransformControl = DataModel.createElement(undefined, 'DmElement', name);
        dmeTransformControl.createAttribute('value', DmAttributeType.Float, valueScale); //TODO
        dmeTransformControl.createAttribute('channel', DmAttributeType.Element, scaleChannel); //TODO
        dmeTransformControl.createAttribute('defaultValue', DmAttributeType.Float, 0.1); //TODO
        return dmeTransformControl;
    }
    #createDmeAnimationSet(name, controls, rootControlGroup /*, gameModel*/) {
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
    #createDmeGameModel(name, modelName, transform, children = [], skin = 0, bodyGroups, bones = []) {
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
    createDmeGameParticleSystem(name, systemName, transform) {
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
    createDmeMaterial(mtlName) {
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
    addGameModelMaterial(gameModel, material) {
        if (gameModel) {
            const materials = gameModel.findAttribute('materials');
            if (materials) {
                materials.setValue(materials.getValue().push(material)); //TODO
            }
            else {
                gameModel.createAttribute('materials', DmAttributeType.ElementArray, [material]);
            }
        }
    }
    #createDmeControlGroup(name, children = [], controls = []) {
        //children = (children instanceof Array) ? children : [];
        //controls = (controls instanceof Array) ? controls : [];
        const dmeControlGroup = DataModel.createElement(undefined, 'DmeControlGroup', name);
        dmeControlGroup.createAttribute('children', DmAttributeType.ElementArray, children);
        dmeControlGroup.createAttribute('controls', DmAttributeType.ElementArray, controls);
        dmeControlGroup.createAttribute('groupColor', DmAttributeType.Color, vec4.fromValues(0, 128, 255, 255) /*'0 128 255 255'*/);
        dmeControlGroup.createAttribute('controlColor', DmAttributeType.Color, vec4.fromValues(200, 200, 200, 255) /*'200 200 200 255'*/);
        dmeControlGroup.createAttribute('visible', DmAttributeType.Bool, true);
        dmeControlGroup.createAttribute('selectable', DmAttributeType.Bool, true);
        dmeControlGroup.createAttribute('snappable', DmAttributeType.Bool, true);
        return dmeControlGroup;
    }
    createAnimSetForModel(name, modelPath, dynamicProp, position, quaternion, parentGameModel, viewTargetPos) {
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
            const viewTargetTransform = this.#createBoneTransform(animSet, 'viewTarget', 'viewTarget', viewTargetPos /*[0, -600, -192]*/, quat.create(), channelsClip.findAttribute('channels'), animSetControls);
            const viewTargetDag = this.createDmeDag('viewTarget', viewTargetTransform, []);
            gameModel.findAttribute('children')?.pushValue(viewTargetDag);
            gameModel.createAttribute('viewTargetDag', DmAttributeType.Element, viewTargetDag);
        }
        if (parentGameModel) {
            this.makeChild(gameModel, parentGameModel);
        }
        return gameModel;
    }
    #getGameModelControlGroup(gameModel, controlName) {
        const defaultControlGroupName = 'Unknown';
        const defaultAnimationGroups = _a.defaultAnimationGroups;
        const controlsGroupName = this.#getGameModelControlGroup2(defaultAnimationGroups?.groupFile, controlName) ?? defaultControlGroupName;
        const controlsGroupArray = controlsGroupName.split('.');
        const currentControlGroup = gameModel.findAttribute('rootControlGroup')?.getValue();
        if (!currentControlGroup) {
            return null;
        }
        const controlGroup = this.#getControlGroup(currentControlGroup, controlsGroupArray);
        return controlGroup;
    }
    #getControlGroup(dmeControlGroup, controlName) {
        const currentControlName = controlName[0];
        if (currentControlName == '') {
            return this.#getControlGroup(dmeControlGroup, controlName.slice(1));
        }
        const childrenArray = dmeControlGroup.findAttribute('children')?.getValue();
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
    #getGameModelControlGroup2(currentLevel /*TODO: improve type*/, controlName) {
        for (const i in currentLevel) {
            const sub = currentLevel[i];
            if (typeof sub == 'object') {
                //if (Array.isArray(sub)) {
                //console.log(i, sub);
                if (i == 'control' && Array.isArray(sub)) {
                    for (const s of sub) {
                        if (s == controlName) {
                            return '';
                        }
                    }
                }
                else {
                    const result = this.#getGameModelControlGroup2(sub, controlName);
                    if (result !== null) {
                        return '.' + i + result;
                    }
                }
            }
        }
        return null;
    }
    getDefaultAnimationGroups() {
        if (_a.defaultAnimationGroups) {
            return _a.defaultAnimationGroups;
        }
        /*var callback = function (defaultAnimationGroups) {
            SfmSession.defaultAnimationGroups = SfmSession.defaultAnimationGroups;
            return defaultAnimationGroups;
        }*/
        //var defaultAnimationGroups = JSONSyncRequest('./assets/json/sfm_defaultanimationgroups.json');
        //let response = await fetch(new Request(SFM_DEFAULT_ANIMATION_GROUPS_URL));
        //let defaultAnimationGroups = await response.json();
        _a.defaultAnimationGroups = SFM_DEFAULT_ANIMATION_GROUPS_URL;
        //return JSONSyncRequest('./assets/json/sfm_defaultanimationgroups.json', callback);
        return _a.defaultAnimationGroups;
    }
    createAnimSetForCamera(name, camera) {
        const animSetControlArray = [];
        const channelArray = [];
        const controlGroup = this.#createDmeControlGroup('all', undefined, animSetControlArray);
        const rootControlGroup = this.#createDmeControlGroup(undefined, [controlGroup]);
        const animSet = this.#createDmeAnimationSet(name, animSetControlArray, rootControlGroup /*, camera*/);
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
            source.createAttribute('value', DmAttributeType.Float, value); //TODO
            source.createAttribute('defaultValue', DmAttributeType.Float, defaultValue); //TODO
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
        const systemTransform = camera.findAttribute('transform')?.value;
        const transformPosChannel = this.#createDmeChannel('transform_pos', cameraTransformControl, 'valuePosition', 0, systemTransform, 'position', 0, 3);
        const transformRotChannel = this.#createDmeChannel('transform_rot', cameraTransformControl, 'valueOrientation', 0, systemTransform, 'orientation', 0, 3);
        const transformPosChannelLog = this.#createDmeTypedLog(DmAttributeType.Vector3, 'vector3 log', [0], [systemTransform.findAttribute('position').value]);
        transformPosChannel.createAttribute('log', DmAttributeType.Element, transformPosChannelLog);
        const transformRotChannelLog = this.#createDmeTypedLog(DmAttributeType.Quaternion, 'quaternion log', [0], [systemTransform.findAttribute('orientation').value]);
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
    #createExpressionOperator(name, result, expr, spewresult) {
        const dmeExpressionOperator = DataModel.createElement(undefined, 'DmeExpressionOperator', name);
        dmeExpressionOperator.createAttribute('result', DmAttributeType.Float, result);
        dmeExpressionOperator.createAttribute('expr', DmAttributeType.String, expr);
        dmeExpressionOperator.createAttribute('spewresult', DmAttributeType.Bool, spewresult);
        return dmeExpressionOperator;
    }
    createRescaleOperator(name, result, lo, hi) {
        const rescaleOperator = this.#createExpressionOperator(name + '_rescale', result, 'lerp(value, lo, hi)', false);
        const value = (result - lo) / (hi - lo);
        rescaleOperator.createAttribute('value', DmAttributeType.Float, value);
        rescaleOperator.createAttribute('lo', DmAttributeType.Float, lo);
        rescaleOperator.createAttribute('hi', DmAttributeType.Float, hi);
        return rescaleOperator;
    }
    #pushAnimSet(animSet) {
        const animationSets = this.filmShot1?.findAttribute('animationSets');
        if (animationSets) {
            animationSets.getValue()?.push(animSet);
        }
        else {
            console.error('Attribute animationSets not found');
        }
    }
    #pushChannelsClip(channelsClip) {
        const children = this.animSetEditorChannels?.findAttribute('children');
        if (children) {
            children.getValue()?.unshift(channelsClip); //TODO: push end
        }
        else {
            console.error('Attribute children not found');
        }
    }
    #pushDagToScene(dag) {
        const children = this.scene?.findAttribute('children');
        if (children) {
            children.getValue()?.push(dag);
        }
        else {
            console.error('Attribute children not found');
        }
    }
    createAnimSetForParticleSystem(name, _, systemName, parentGameModel, boneName, controlPoints) {
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
            controlPoints[i];
        }
        const pyroGameModelBodyControlGroup = this.#createDmeControlGroup('all', undefined, transfomControlArray /*[control1, control2, control9]*/);
        const gameModelRootControlGroup = this.#createDmeControlGroup(undefined, [pyroGameModelBodyControlGroup]);
        const animSet = this.#createDmeAnimationSet(name, transfomControlArray, gameModelRootControlGroup /*, gameModel*/);
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
        const channelsClip = this.#createDmeChannelsClip(name, this.#createDmeTimeFrame(name, -5, 70), [emittingChannel, visibleChannel, simulatingChannel, transformPosChannel, transformRotChannel].concat(channelArray));
        /*****************/
        let head = this.#findBone(parentGameModel, boneName); //.findAttribute('transform');
        console.error(head);
        if (!head) {
            head = parentGameModel;
        }
        gameModel.createAttribute('children', DmAttributeType.ElementArray, controlPointsDagArray /*[dmeDagControlPoint0, dmeDagControlPoint9]*/);
        gameModel.createAttribute('controlPoints', DmAttributeType.ElementArray, controlPointsArray /*[transformControlPoint0, transformControlPoint9]*/);
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
    makeChild(gameModel, parentGameModel) {
        gameModel.createAttribute('overrideParent', DmAttributeType.Element, parentGameModel);
        gameModel.createAttribute('overridePos', DmAttributeType.Bool, true);
        gameModel.createAttribute('overrideRot', DmAttributeType.Bool, true);
        const childArray = gameModel.findAttribute('children')?.getValue();
        for (const child of childArray) {
            this.#linkBoneChild(child, parentGameModel);
        }
    }
    #getBoneName(element) {
        const elementName = element.findAttribute('name')?.getValue();
        const result = /^bone \d* \((.*)\)$/.exec(elementName);
        if (result && result[1]) {
            return result[1];
        }
        return elementName;
    }
    #linkBoneChild(bone, parentGameModel) {
        const boneName = this.#getBoneName(bone);
        const parentBone = this.#findBone(parentGameModel, boneName);
        if (parentBone) {
            bone.createAttribute('overrideParent', DmAttributeType.Element, parentBone);
            bone.createAttribute('overridePos', DmAttributeType.Bool, true);
            bone.createAttribute('overrideRot', DmAttributeType.Bool, true);
            const transform = bone.findAttribute('transform')?.getValue();
            vec3.zero(transform.findAttribute('position').getValue());
            vec4.zero(transform.findAttribute('orientation').getValue());
        }
        const children = bone.findAttribute('children');
        if (children) {
            const childArray = children.getValue();
            if (childArray) {
                for (const child of childArray) {
                    //const child = childArray[i]!;
                    this.#linkBoneChild(child, parentGameModel);
                }
            }
        }
    }
    #findBone(gameModel, boneName) {
        const children = gameModel.findAttribute('children');
        if (children) {
            const childArray = children.getValue();
            if (childArray) {
                for (const child of childArray) {
                    //const child = childArray[i];
                    if (child) {
                        const bn = this.#getBoneName(child); //child.findAttribute('name').getValue();
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
    #createGameModelBones(gameModel, animSet, dynamicProp, parentGameModel, channelsClip, animSetControls) {
        const boneTmp = new Map();
        //const boneTmp2 = new Map<string, number>();
        const elementArray = [];
        const transformArray = [];
        const sourceModel = dynamicProp.sourceModel;
        const boneArray = dynamicProp.skeleton?._bones; //sourceModel.getBones() || [];
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
                    }
                    else {
                        bonePos = bone.getPosition(); //vec3.sub(vec3.create(), bone.worldPos, bone.parent.worldPos)//bone.position;
                        boneQuat = bone.getQuaternion();
                    }
                    const boneScale = bone.scale[0]; //TODO: set 3D scale;
                    const boneTransform = this.#createBoneTransform(animSet, boneName, boneName2, bonePos, boneQuat, channelsClip.findAttribute('channels'), animSetControls, boneScale);
                    const boneDmeDag = this.createDmeDag(boneName, boneTransform, []);
                    boneTmp.set(bone, boneDmeDag);
                    if (!illumPositionDag) {
                        illumPositionDag = boneDmeDag;
                    }
                    transformArray.push(boneTransform);
                    if (bone.parent instanceof Skeleton) {
                        elementArray.push(boneDmeDag);
                    }
                    else {
                        const children = boneTmp.get(bone.parent)?.findAttribute('children');
                        if (children) {
                            children.getValue()?.push(boneDmeDag);
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
                if (bone /* && ((bone.flags & BONE_USED_MASK) > BONE_USED_BY_VERTEX_LOD0 * 0)*/) {
                    const boneName2 = /*'atta_' + */ bone.name;
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
                            children.getValue().push(boneDmeDag);
                        }
                    }
                    //}
                }
            }
        }
        //return transformArray;
        const bones = gameModel.findAttribute('bones');
        if (bones) {
            bones.setValue(bones.getValue().concat(transformArray)); //TODO
        }
        const children = gameModel.findAttribute('children');
        if (children) {
            children.setValue(children.getValue().concat(elementArray)); //TODO
        }
        gameModel.createAttribute('illumPositionDag', DmAttributeType.Element, illumPositionDag);
    }
    #createBoneTransform(gameModel, boneName1, boneName2, bonePos, boneQuat, channelsClip, animSetControls, boneScale) {
        const boneTransform = this.#createDmeTransform(boneName1, bonePos, boneQuat, boneScale);
        const boneTransformControl = this.#createDmeTransformControl(boneName2);
        const bonePosChannel = this.#createDmeChannel(boneName2 + '_p', boneTransformControl, 'valuePosition', 0, boneTransform, 'position', 0, 3);
        const boneRotChannel = this.#createDmeChannel(boneName2 + '_o', boneTransformControl, 'valueOrientation', 0, boneTransform, 'orientation', 0, 3);
        if (boneScale !== undefined) {
            const boneScaleChannel = this.#createDmeChannel(boneName2 + '_scale', boneTransformControl, 'value', 0, boneTransform, 'value', 0, 3);
            boneTransformControl.createAttribute('scaleChannel', DmAttributeType.Element, boneScaleChannel);
            channelsClip?.getValue()?.push(boneScaleChannel);
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
            source.createAttribute('value', DmAttributeType.Float, value); //TODO
            source.createAttribute('defaultValue', DmAttributeType.Float, defaultValue); //TODO
            const scaleChannel = this.#createDmeChannel('scaled_' + boneName2 + '_scale_channel', scaleOperator, 'result', 0, boneTransform, 'scale', 0, 1);
            const scaleChannelLog = this.#createDmeTypedLog(DmAttributeType.Float, 'float log', [], []);
            scaleChannel.createAttribute('log', DmAttributeType.Element, scaleChannelLog);
            //animSet.findAttribute('controls').pushValue(source);
            //animSetControlArray.push(source);
            animSetControls?.getValue()?.push(source);
            gameModel.findAttribute('operators')?.pushValue(scaleOperator);
            channelsClip?.getValue()?.push(channel);
            channelsClip?.getValue()?.push(scaleChannel);
            const controlGroup = this.#getGameModelControlGroup(gameModel, boneName2); //TODO
            controlGroup?.findAttribute('controls')?.pushValue(boneTransformControlScale);
        }
        boneTransformControl.createAttribute('positionChannel', DmAttributeType.Element, bonePosChannel);
        boneTransformControl.createAttribute('orientationChannel', DmAttributeType.Element, boneRotChannel);
        channelsClip?.getValue()?.push(bonePosChannel);
        channelsClip?.getValue()?.push(boneRotChannel);
        animSetControls?.getValue()?.push(boneTransformControl);
        const transformPosChannelLog = this.#createDmeTypedLog(DmAttributeType.Vector3, 'vector3 log', [0], [bonePos]);
        bonePosChannel.createAttribute('log', DmAttributeType.Element, transformPosChannelLog);
        const transformRotChannelLog = this.#createDmeTypedLog(DmAttributeType.Quaternion, 'quaternion log', [0], [boneQuat]);
        boneRotChannel.createAttribute('log', DmAttributeType.Element, transformRotChannelLog);
        const controlGroup = this.#getGameModelControlGroup(gameModel, boneName2); //TODO
        controlGroup?.findAttribute('controls')?.pushValue(boneTransformControl);
        return boneTransform;
    }
    #createGameModelFlexes(gameModel, animSet, sourceModel, channelsClip, pyroGameModelBodyControlGroup) {
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
                const flexWeight = flexController.min < 0 ? 0.5 : 0.0; //TODO: get the stereo flag from controllerui
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
                pyroGameModelBodyControlGroup?.getValue()?.push(flexElement);
                const controlGroup = this.#getGameModelControlGroup(animSet, flexName); //TODO
                controlGroup?.findAttribute('controls')?.pushValue(flexElement);
            }
        }
        return;
    }
    createDmeTextFXClip(name, text, textColor = vec4.fromValues(255, 255, 255, 255), fontName) {
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
    }
    ;
    DmeMaterialOverlayFXClip(name, overlayColor = vec4.fromValues(255, 255, 255, 255), materialName) {
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
    }
    ;
    addLight(lightName, cameraPos, cameraOrientation /*lookAt*/) {
        this.#createDmeProjectedLight(lightName);
        //const gameModelRootControlGroup = this.#createDmeControlGroup();
        const result = this.#createAnimSetFromTemplate('DmeProjectedLight', lightName);
        const animSet = result[0];
        const light = result[1];
        animSet?.createAttribute('light', DmAttributeType.Element, light);
        //cameraOrientation = LookAt(cameraPos, lookAt, [0, 0, 1]);
        const lightTransform = this.#createDmeTransform(undefined, cameraPos, cameraOrientation);
        light?.findAttribute('transform')?.setValue(lightTransform);
        this.lightsDag = this.lightsDag ?? (() => { const a = this.createDmeDag('Lights', this.#createDmeTransform(), []); this.#pushDagToScene(a); return a; })();
        this.lightsDag.findAttribute('children')?.pushValue(light);
        return result;
    }
    #createDmeProjectedLight(lightName /*, lightOptions*/) {
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
    #createAnimSetFromTemplate(elementType, elementName) {
        const animSet = this.#createElementFromTemplate('DmeAnimationSet', elementName);
        const element = this.#createElementFromTemplate(elementType, elementName);
        const animSetControlArray = [];
        const channelArray = [];
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
                        const systemTransform = element?.findAttribute('transform')?.value;
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
                    }
                    else {
                        const sourceDmeElement = this.#createElementFromTemplate('DmElement', attribName); //DataModel.createElement(undefined, 'DmElement', chanel.name);
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
                        }
                        else {
                            console.error('aa');
                        }
                        if (sourceDmeElement && toElement) {
                            const dmeChannel = this.#createDmeChannel(attribType, sourceDmeElement, 'value', 0, toElement, toAttribute, 0, 1);
                            sourceDmeElement.createAttribute('channel', DmAttributeType.Element, dmeChannel);
                            sourceDmeElement.createAttribute('value', DmAttributeType.Float, attribChannel.value); //TODO
                            sourceDmeElement.createAttribute('defaultValue', DmAttributeType.Float, attribChannel.value /*defaultValue*/); //TODO
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
    #createElementFromTemplate(elementType, elementName) {
        const templates = elementTemplates[elementType];
        let element = null;
        if (templates) {
            element = DataModel.createElementNew(elementType, elementName);
            Object.keys(templates).forEach((key) => {
                const value = templates[key];
                const attribType = value[0];
                const attribValue = value[1];
                if (attribType == DmAttributeType.Element) {
                    const childElement = this.#createElementFromTemplate(attribValue, elementName + '_' + key);
                    element.createAttribute(key, attribType, childElement);
                }
                else {
                    element.createAttribute(key, attribType, attribValue);
                }
            });
        }
        return element;
    }
    ;
    animSetSetControlValue(animSet, controlName, value) {
        const controlArray = animSet.findAttribute('controls')?.value;
        for (const control of controlArray) {
            const name = control.findAttribute('name')?.value;
            if (controlName == name) {
                //console.log(control);
                control.setAttributeValue('value', value);
            }
        }
    }
    ;
}
_a = SfmSession;
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
];
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
};
elementTemplates['DmeAnimationSet'] = {
    'controls': [DmAttributeType.ElementArray, null],
    'presetGroups': [DmAttributeType.ElementArray, null],
    'phonememap': [DmAttributeType.ElementArray, null],
    'operators': [DmAttributeType.ElementArray, null],
    'rootControlGroup': [DmAttributeType.Element, 'DmeControlGroup'],
};
elementTemplates['DmeTransform'] = {
    'position': [DmAttributeType.Vector3, vec3.create()],
    'orientation': [DmAttributeType.Quaternion, quat.create()],
};
elementTemplates['DmElement'] = {};
/**
 * TODO
 */

class SfmExporter {
    static async exportSFM(scene, mapName, rollAngle) {
        const originDelta = vec3.fromValues(0, -300, -192);
        const originQuat = quat.create(); // = [0, 0, -1, 1];
        const sfm = new SfmSession(mapName);
        sfm.getDefaultAnimationGroups();
        //originQuat = originQuat ?? quat.create();
        quat.normalize(originQuat, originQuat);
        //var ModelListtoto = SourceEngine.Models.ModelManager.getModels();
        const modelList = scene.getChildList('Source1ModelInstance');
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
            const lightPos = lights[i];
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
    static async ExportSFMCharacter(sfm, prop, name, originDelta, originQuat) {
        const modelReplace = {
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
        };
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
                parentProp.getProperty('characterGameModel');
            }
            //if (prop.tint)
            {
                const textureList = prop.sourceModel.mdl.textures; //TODOV2
                if (textureList) {
                    for (const texture of textureList) {
                        const materialName = prop.sourceModel.mdl.getMaterialName(Number(prop.skin), 0); //TODO
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
                                const s = '000000' + (prop.getProperty('weapon_stattrak_kill_count')?.value ?? 0).toString();
                                const startPos = s.length - 1 - digitPos;
                                const digit = parseInt(s[startPos], 10);
                                //console.log(result);
                                overrideMaterial.createAttribute('$frame', DmAttributeType.Int, digit);
                            }
                        }
                        sfm.addGameModelMaterial(characterGameModel, overrideMaterial);
                    }
                }
            }
            const effectsList = prop.children;
            if (effectsList) {
                for (const effect of effectsList) {
                    if (!effect.isParticleSystem) {
                        continue;
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
function ColorFloatToVec4(color) {
    if (!color) {
        return vec4.fromValues(255, 255, 255, 255);
    }
    return vec4.fromValues(Math.round(color[0] * 255), Math.round(color[1] * 255), Math.round(color[2] * 255), color[3] === undefined ? 255 : Math.round(color[3] * 255));
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

export { SfmExporter };
