import { DmAttribute } from './dmattribute';
import { DmAttributeType } from './dmattributetypes';



function DECLARE_ATTRIBUTE_TYPE(_className: string, _attributeType: number, _attributeName: string, _defaultSetStatement: string) {
	DECLARE_ATTRIBUTE_TYPE_INTERNAL(_className, _className, _attributeType, _attributeName, _defaultSetStatement);
}

function DECLARE_ATTRIBUTE_ARRAY_TYPE(_className: string, _attributeType: number, _attributeName: string) {
	DECLARE_ATTRIBUTE_TYPE_INTERNAL(_className, _className, _attributeType, _attributeName);
}
//DmAttribute.s_pAttrInfo = DmAttribute.s_pAttrInfo ?? [];//TODO: fix this shit

function DECLARE_ATTRIBUTE_TYPE_INTERNAL(_className: string, _storageType: string, _attributeType: number, _attributeName: string, _defaultSetStatement?: string) {
	const t = new DmAttributeInfo(_className, _storageType, _attributeType, _attributeName, _defaultSetStatement);
	DmAttribute.s_pAttrInfo[_attributeType] = t;
}

function DECLARE_ATTRIBUTE_ARRAY_TYPE_INTERNAL(_className: string, _storageType: string, _attributeType: number, _attributeName: string) {
	const t = new DmAttributeInfo(_className, _storageType, _attributeType, _attributeName);
	DmAttribute.s_pAttrInfo[_attributeType] = t;
}

export class DmAttributeInfo {
	ATTRIBUTE_TYPE;
	attributeType;
	attributeName;
	defaultSetStatement;

	constructor(_className: string, _storageType: string, _attributeType: number, _attributeName: string, _defaultSetStatement?: string) {
		this.ATTRIBUTE_TYPE = _attributeType;
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



	/*typedef _storageType StorageType_t;									\
	static DmAttributeType_t AttributeType() { return _attributeType; }	\
	static const char *AttributeTypeName() { return _attributeName; }	\
	static void SetDefaultValue( _className& value ) { _defaultSetStatement }	\	*/

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
DECLARE_ATTRIBUTE_TYPE_INTERNAL('DmElementHandle_t', 'DmElementAttribute_t', DmAttributeType.Element, 'element', 'value = DMELEMENT_HANDLE_INVALID;')



DECLARE_ATTRIBUTE_ARRAY_TYPE('int', DmAttributeType.IntArray, 'int_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('float', DmAttributeType.FloatArray, 'float_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('bool', DmAttributeType.BoolArray, 'bool_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('Color', DmAttributeType.ColorArray, 'color_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('Vector2D', DmAttributeType.Vector2Array, 'vector2_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('Vector', DmAttributeType.Vector3Array, 'vector3_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('Vector4D', DmAttributeType.Vector4Array, 'vector4_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('QAngle', DmAttributeType.QAngleArray, 'qangle_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('Quaternion', DmAttributeType.QuaternionArray, 'quaternion_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('VMatrix', DmAttributeType.VMatrixArray, 'matrix_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('CUtlString', DmAttributeType.StringArray, 'string_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('CUtlBinaryBlock', DmAttributeType.VoidArray, 'binary_array')
//DECLARE_ATTRIBUTE_ARRAY_TYPE('DmObjectId_t',		DmAttributeType.ObjectIdArray,		'elementid_array' )
DECLARE_ATTRIBUTE_ARRAY_TYPE('DmObjectId_t', DmAttributeType.ObjectIdArray, 'time_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE_INTERNAL('DmElementHandle_t', 'DmElementArray_t', DmAttributeType.ElementArray, 'element_array')
