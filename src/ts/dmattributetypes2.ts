import { DmAttribute } from './dmattribute'
import { AT_ELEMENT, AT_INT, AT_FLOAT, AT_BOOL, AT_STRING, AT_VOID, AT_OBJECTID, AT_TIME, AT_COLOR, AT_VECTOR2, AT_VECTOR3, AT_VECTOR4, AT_QANGLE, AT_QUATERNION, AT_VMATRIX } from './dmattributetypes';
import { AT_ELEMENT_ARRAY, AT_INT_ARRAY, AT_FLOAT_ARRAY, AT_BOOL_ARRAY, AT_STRING_ARRAY, AT_VOID_ARRAY, AT_OBJECTID_ARRAY, AT_TIME_ARRAY, AT_COLOR_ARRAY, AT_VECTOR2_ARRAY, AT_VECTOR3_ARRAY, AT_VECTOR4_ARRAY, AT_QANGLE_ARRAY, AT_QUATERNION_ARRAY, AT_VMATRIX_ARRAY } from './dmattributetypes';



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


DECLARE_ATTRIBUTE_TYPE('int', AT_INT, 'int', 'value = 0;');
DECLARE_ATTRIBUTE_TYPE('float', AT_FLOAT, 'float', 'value = 0.0f;');
DECLARE_ATTRIBUTE_TYPE('bool', AT_BOOL, 'bool', 'value = false;');
DECLARE_ATTRIBUTE_TYPE('Color', AT_COLOR, 'color', 'value.SetColor( 0, 0, 0, 255 );');
DECLARE_ATTRIBUTE_TYPE('Vector2D', AT_VECTOR2, 'vector2', 'value.Init( 0.0f, 0.0f );');
DECLARE_ATTRIBUTE_TYPE('Vector', AT_VECTOR3, 'vector3', 'value.Init( 0.0f, 0.0f, 0.0f );');
DECLARE_ATTRIBUTE_TYPE('Vector4D', AT_VECTOR4, 'vector4', 'value.Init( 0.0f, 0.0f, 0.0f, 0.0f );');
DECLARE_ATTRIBUTE_TYPE('QAngle', AT_QANGLE, 'qangle', 'value.Init( 0.0f, 0.0f, 0.0f );');
DECLARE_ATTRIBUTE_TYPE('Quaternion', AT_QUATERNION, 'quaternion', 'value.Init( 0.0f, 0.0f, 0.0f, 1.0f );');
DECLARE_ATTRIBUTE_TYPE('VMatrix', AT_VMATRIX, 'matrix', 'MatrixSetIdentity( value );');
DECLARE_ATTRIBUTE_TYPE('CUtlString', AT_STRING, 'string', 'value.Set( NULL );');
DECLARE_ATTRIBUTE_TYPE('CUtlBinaryBlock', AT_VOID, 'binary', 'value.Set( NULL, 0 );');
//DECLARE_ATTRIBUTE_TYPE('DmObjectId_t',			AT_OBJECTID,			'elementid',	'InvalidateUniqueId( &value );' );
DECLARE_ATTRIBUTE_TYPE('DmObjectId_t', AT_OBJECTID, 'time', 'InvalidateUniqueId( &value );');
DECLARE_ATTRIBUTE_TYPE_INTERNAL('DmElementHandle_t', 'DmElementAttribute_t', AT_ELEMENT, 'element', 'value = DMELEMENT_HANDLE_INVALID;')



DECLARE_ATTRIBUTE_ARRAY_TYPE('int', AT_INT_ARRAY, 'int_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('float', AT_FLOAT_ARRAY, 'float_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('bool', AT_BOOL_ARRAY, 'bool_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('Color', AT_COLOR_ARRAY, 'color_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('Vector2D', AT_VECTOR2_ARRAY, 'vector2_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('Vector', AT_VECTOR3_ARRAY, 'vector3_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('Vector4D', AT_VECTOR4_ARRAY, 'vector4_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('QAngle', AT_QANGLE_ARRAY, 'qangle_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('Quaternion', AT_QUATERNION_ARRAY, 'quaternion_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('VMatrix', AT_VMATRIX_ARRAY, 'matrix_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('CUtlString', AT_STRING_ARRAY, 'string_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE('CUtlBinaryBlock', AT_VOID_ARRAY, 'binary_array')
//DECLARE_ATTRIBUTE_ARRAY_TYPE('DmObjectId_t',		AT_OBJECTID_ARRAY,		'elementid_array' )
DECLARE_ATTRIBUTE_ARRAY_TYPE('DmObjectId_t', AT_OBJECTID_ARRAY, 'time_array')
DECLARE_ATTRIBUTE_ARRAY_TYPE_INTERNAL('DmElementHandle_t', 'DmElementArray_t', AT_ELEMENT_ARRAY, 'element_array')
