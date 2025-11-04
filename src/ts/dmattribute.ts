import { quat, vec2, vec3, vec4 } from 'gl-matrix';
import { FATTRIB_TOPOLOGICAL, FATTRIB_TYPEMASK } from './attributeflags';
import { AT_UNKNOWN, AT_ELEMENT, AT_INT, AT_FLOAT, AT_BOOL, AT_STRING, AT_VOID, AT_OBJECTID, AT_TIME, AT_COLOR, AT_VECTOR2, AT_VECTOR3, AT_VECTOR4, AT_QANGLE, AT_QUATERNION, AT_VMATRIX } from './dmattributetypes';
import { AT_FIRST_ARRAY_TYPE, AT_ELEMENT_ARRAY, AT_OBJECTID_ARRAY, AT_TYPE_COUNT } from './dmattributetypes';
import { DmAttributeInfo, DmElement } from './dmelement';
import { UtlBuffer } from './utlbuffer';

export const DMATTRIBUTE_HANDLE_INVALID = -1;

export class DmAttribute {
	owner: DmElement;
	name: string;
	type: number;
	value?: any;
	m_Handle = DMATTRIBUTE_HANDLE_INVALID;
	next?: DmAttribute;
	m_nFlags: number;
	static s_pAttrInfo: DmAttributeInfo[] = [];//TODO: fix this shit

	constructor(owner: DmElement, attributeType: number/*TODO: create enum*/, attributeName: string) {
		this.owner = owner;
		this.name = attributeName;
		this.type = attributeType;
		this.m_nFlags = attributeType;

		switch (attributeType) {
			case AT_ELEMENT:
			case AT_ELEMENT_ARRAY:
			case AT_OBJECTID:
			case AT_OBJECTID_ARRAY:
				this.m_nFlags |= FATTRIB_TOPOLOGICAL;
				break;
		}
	}

	static createAttribute(owner: DmElement, attributeType: number, attributeName: string) {
		if (owner.isDmElement /*TODO: remove test*/
			&& typeof attributeType == 'number'
			&& typeof attributeName == 'string'
		) {
			switch (attributeType) {
				case AT_UNKNOWN:
					//Assert( 0 );TODO
					return null;
				default:
					return new DmAttribute(owner, attributeType, attributeName);
			}
		} else {
			console.error('Invalid attributes in DmAttribute.createAttribute : ', owner, attributeType, attributeName);
		}
		return null;
	}

	getName() {
		return this.name;
	}
	getType() {
		//	return this.type;
		return this.m_nFlags & FATTRIB_TYPEMASK;
	}

	setNextAttribute(attribute: DmAttribute | undefined) {
		this.next = attribute;
	}

	getNextAttribute() {
		return this.next;
	}


	checkCyclicRedundancy(other: DmAttribute) {
		let current: DmAttribute | undefined = this;

		do {
			if (current == other) {
				return true;
			}
			current = current.next;
		} while (current)

		return false;
	}

	findAttribute(attributeName: string): DmAttribute | undefined {
		let current: DmAttribute | undefined = this;

		do {
			if (current.name == attributeName) {//TODO:GetNameSymbol
				return current;
			}
			current = current.next;
		} while (current)

		return;
	}

	nextAttribute() {
		return this.next;
	}

	isFlagSet(flags: number) {
		return (flags & this.m_nFlags) ? true : false;
	}

	setValue(value?: any) {
		/* TODO check value / type*/
		this.value = value;
	}

	getValue() {
		return this.value;
	}

	pushValue(value?: any) {
		//TODO: check value type ?
		if (this.type < AT_FIRST_ARRAY_TYPE) {
			console.error('Trying to push value in non array attribute');
		}

		this.value = this.value || [];
		this.value.push(value);
	}

	getValueElement() {
		return this.value;
	}

	serialize(buf: UtlBuffer) {
		/*switch (this.type) {
			case AT_STRING:
				buf.putDelimitedString(this.getValue());
				return buf.isValid();
			case AT_FLOAT:
			case AT_INT:
				var v = this.getValue() || 0;
				buf.putString(v.toString());
				return buf.isValid();
			case AT_BOOL:
				buf.putString(this.getValue() ? '1' : '0');
				return buf.isValid();
			case AT_VECTOR3:
				var v = this.getValue() || vec3.create();
				buf.putString(v[0] + ' ' + v[1] + ' ' + v[2]);
				return buf.isValid();
			case AT_QUATERNION:
				console.error(this.getValue());
				var q = this.getValue() || quat.create();
				buf.putString(q[0] + ' ' + q[1] + ' ' + q[2] + ' ' + q[3]);
				return buf.isValid();
			case AT_COLOR:
				var q = this.getValue() || vec4.create();
				buf.putString(q[0] + ' ' + q[1] + ' ' + q[2] + ' ' + (q[3] || 0 ));
				return buf.isValid();
			case AT_TIME:
				buf.putString(this.getValue().toFixed(4));
				return buf.isValid();
			default:
				console.error('serialize not coded for type ' + this.type);
				//TODO;
		}
		*/
		this.#serialize(this.getValue(), buf);
	}

	serializeIndex(index: number, buf: UtlBuffer) {
		this.#serialize(this.getValue()[index], buf);
	}

	#serialize(value: any, buf: UtlBuffer) {
		const type = this.type % (AT_FIRST_ARRAY_TYPE - 1);
		switch (type) {
			case AT_STRING:
				buf.putDelimitedString(value);
				return buf.isValid();
			case AT_FLOAT:
			case AT_INT:
				var v = value || 0;
				buf.putString(v.toString());
				return buf.isValid();
			case AT_BOOL:
				buf.putString(value ? '1' : '0');
				return buf.isValid();
			case AT_VECTOR2:
				var v = value || vec2.create();
				buf.putString(v[0] + ' ' + v[1]);
				return buf.isValid();
			case AT_VECTOR3:
				var v = value || vec3.create();
				buf.putString(v[0] + ' ' + v[1] + ' ' + v[2]);
				return buf.isValid();
			case AT_QUATERNION:
				var q = value || quat.create();
				quat.normalize(q, q);
				buf.putString(q[0] + ' ' + q[1] + ' ' + q[2] + ' ' + q[3]);
				return buf.isValid();
			case AT_COLOR:
				var q = value || vec4.create();
				buf.putString(q[0] + ' ' + q[1] + ' ' + q[2] + ' ' + (q[3] || 0));
				return buf.isValid();
			case AT_TIME:
				buf.putString(value.toFixed(4));
				return buf.isValid();
			default:
			//console.error('serialize not coded for type ' + type);
			//TODO;
		}
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
export function AttributeTypeName(type: number) {
	if ((type >= 0) && (type < AT_TYPE_COUNT)) {
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

	return AT_UNKNOWN;
}

function Q_stricmp(str1, str2) {
	var s1 = str1.toLowerCase();
	var s2 = str2.toLowerCase();
	return ((s1 == s2) ? 0 : ((s1 > s2) ? 1 : -1));
}
*/
