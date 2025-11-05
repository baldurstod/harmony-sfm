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

export enum DmAttributeType {
	// TODO: turn numeric
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
	Vector2 =10,
	Vector3 = 11,
	Vector4 = 12,
	QAngle = 13,
	Quaternion = 14,
	VMatrix = 15,

	// Arrays
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
	VMatrixArray = 30,
}

export const DmAttributeTypeFirst = DmAttributeType.Element;
export const DmAttributeTypeFirstArray = DmAttributeType.ElementArray;
export const DmAttributeTypeLast = DmAttributeType.VMatrix;
export const DmAttributeTypeLastArray = DmAttributeType.VMatrixArray;

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
