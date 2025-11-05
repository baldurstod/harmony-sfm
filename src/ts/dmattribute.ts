import { quat, vec2, vec3, vec4 } from 'gl-matrix';
import { FATTRIB_TOPOLOGICAL } from './attributeflags';
import { DmAttributeType, DmAttributeTypeFirstArray, DmAttributeTypeLastArray } from './dmattributetypes';
import { DmAttributeInfo, DmElement } from './dmelement';
import { UtlBuffer } from './utlbuffer';

export const DMATTRIBUTE_HANDLE_INVALID = -1;


type DmAttributeValueSingle = string | DmElement | boolean | number | vec2 | vec3 | vec4;
export type DmAttributeValue = DmAttributeValueSingle | DmAttributeValueSingle[];


//export type CDmxAttributeValue = null | undefined | boolean | number | CDmxElement | ParticleColor | vec2 | vec3 | vec4 | string;

export class DmAttribute {
	readonly owner: DmElement;
	readonly name: string;
	readonly type: DmAttributeType;
	value: DmAttributeValue | null = null;
	m_Handle = DMATTRIBUTE_HANDLE_INVALID;
	next: DmAttribute | null = null;
	m_nFlags: number;
	static s_pAttrInfo: DmAttributeInfo[] = [];//TODO: fix this shit

	constructor(owner: DmElement, type: DmAttributeType, name: string) {
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

	static createAttribute(owner: DmElement, type: DmAttributeType, name: string): DmAttribute | null {
		switch (type) {
			case DmAttributeType.Unknown:
				return null;
			default:
				return new DmAttribute(owner, type, name);
		}
	}

	setNextAttribute(attribute: DmAttribute | null): void {
		this.next = attribute;
	}

	getNextAttribute(): DmAttribute | null {
		return this.next;
	}


	checkCyclicRedundancy(other: DmAttribute): boolean {
		let current: DmAttribute | null = this;

		do {
			if (current == other) {
				return true;
			}
			current = current.next;
		} while (current)

		return false;
	}

	findAttribute(attributeName: string): DmAttribute | null {
		let current: DmAttribute | null = this;

		do {
			if (current.name == attributeName) {//TODO:GetNameSymbol
				return current;
			}
			current = current.next;
		} while (current)

		return null;
	}

	nextAttribute() {
		return this.next;
	}

	isFlagSet(flags: number) {
		return (flags & this.m_nFlags) ? true : false;
	}

	setValue(value: DmAttributeValue | null): void {
		/* TODO check value / type*/
		this.value = value;
	}

	getValue(): DmAttributeValue | null {
		return this.value as DmAttributeValue;
	}

	pushValue(value: DmAttributeValue | null) {
		//TODO: check value type ?
		if (this.type < DmAttributeTypeFirstArray) {
			console.error('Trying to push value in non array attribute');
		}

		(this.value as any[]).push(value);
	}

	serialize(buf: UtlBuffer): void {
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

	serializeIndex(index: number, buf: UtlBuffer): void {
		if (this.type < DmAttributeTypeFirstArray) {
			return;
		}

		const value = (this.getValue() as unknown as DmAttributeValueSingle[])?.[index];
		if (value) {
			this.#serialize(value, buf);
		}
	}

	#serialize(value: DmAttributeValue, buf: UtlBuffer): boolean {
		const type = this.type % (DmAttributeTypeFirstArray - 1);
		switch (type) {
			case DmAttributeType.String:
				buf.putDelimitedString(value as string);
				return buf.isValid();
			case DmAttributeType.Float:
			case DmAttributeType.Int:
				buf.putString(String(value));
				return buf.isValid();
			case DmAttributeType.Bool:
				buf.putString(value ? '1' : '0');
				return buf.isValid();
			case DmAttributeType.Vector2:
				buf.putString((value as vec2)[0] + ' ' + (value as vec2)[1]);
				return buf.isValid();
			case DmAttributeType.Vector3:
				buf.putString((value as vec3)[0] + ' ' + (value as vec3)[1] + ' ' + (value as vec3)[2]);
				return buf.isValid();
			case DmAttributeType.Quaternion:
				quat.normalize(value as quat, value as quat);
				buf.putString((value as quat)[0] + ' ' + (value as quat)[1] + ' ' + (value as quat)[2] + ' ' + (value as quat)[3]);
				return buf.isValid();
			case DmAttributeType.Color:
				buf.putString((value as vec4)[0] + ' ' + (value as vec4)[1] + ' ' + (value as vec4)[2] + ' ' + ((value as vec4)[3] ?? 0));
				return buf.isValid();
			case DmAttributeType.Time:
				buf.putString((value as number).toFixed(4));
				return buf.isValid();
			default:
		}
		return false
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
	if ((type >= 0) && (type <= DmAttributeTypeLastArray)) {
		return DmAttribute.s_pAttrInfo[type]!.getAttributeTypeName();
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
