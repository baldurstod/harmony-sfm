import { FATTRIB_DONTSAVE } from './attributeflags';
import { DataModel } from './datamodel';
import { DmAttribute } from './dmattribute';
import { AT_ELEMENT, AT_STRING } from './dmattributetypes';
import { AT_FIRST_ARRAY_TYPE, AT_ELEMENT_ARRAY, AT_STRING_ARRAY } from './dmattributetypes';
import { DmElement } from './dmelement';
import { DmElementSerializationDictionary, ELEMENT_DICT_HANDLE_INVALID } from './dmelementserializationdictionary';
import { UtlBuffer } from './utlbuffer';
import { Serialize, SetSerializationDelimiter, SetSerializationArrayDelimiter } from './utlbufferutil';


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

export class DmSerializerKeyValues2 {
	#flatMode: boolean;
	constructor(flatmode: boolean) {
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

	serialize(outBuf: UtlBuffer, root: DmElement) {
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

		SetSerializationDelimiter();
		SetSerializationArrayDelimiter();

		return true;
	}

	//bool CDmSerializerKeyValues2::SaveElement( CUtlBuffer& buf, CDmElementSerializationDictionary &dict, CDmElement *pElement, bool bWriteDelimiters )
	saveElement(buf: UtlBuffer, dict: DmElementSerializationDictionary, pElement: DmElement | undefined, bWriteDelimiters = true) {
		if (!pElement) {
			return false;
		}
		if (bWriteDelimiters) {
			buf.putString('\"' + pElement.getTypeString() + '\"\n{\n');
		}
		buf.pushTab();

		// explicitly serialize id, now that it's no longer an attribute
		//buf.Printf('\"id\" \"%s\" ', DataModel.GetAttributeNameForType(AT_OBJECTID));
		//buf.putString('\"id\" \"' + DataModel.GetAttributeNameForType(AT_OBJECTID) + '\" ');
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

	serializeAttributes(buf: UtlBuffer, dict: DmElementSerializationDictionary, pElement: DmElement) {
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

			const pName = pAttribute.getName();
			const nAttrType = pAttribute.getType();
			if (nAttrType != AT_ELEMENT) {
				buf.putString('\"' + pName + '\" \"' + DataModel.GetAttributeNameForType(nAttrType) + '\" ');
			} else {
				// Elements either serialize their type name or 'element' depending on whether they are inlined
				buf.putString('\"' + pName + '\" ');
			}

			switch (nAttrType) {
				default:
					if (nAttrType >= AT_FIRST_ARRAY_TYPE) {
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

				case AT_STRING:
					// Don't explicitly add string delimiters; serialization does that.
					pAttribute.serialize(buf);
					break;
				case AT_ELEMENT:
					this.#serializeElementAttribute(buf, dict, pAttribute);
					break;

				case AT_ELEMENT_ARRAY:
					this.#serializeElementArrayAttribute(buf, dict, pAttribute);
					//console.error('SerializeElementArrayAttribute( buf, dict, pAttribute );');TODO REMOVE me
					break;
			}

			buf.putChar('\n');
		}

		return true;

	}

	#serializeElementAttribute(buf: UtlBuffer, dict: DmElementSerializationDictionary, pAttribute: DmAttribute) {
		const pElement = pAttribute.getValue();
		if (dict.shouldInlineElement(pElement)) {
			buf.putString('\"' + pElement.getTypeString() + '\"\n{\n');
			if (pElement) {
				this.saveElement(buf, dict, pElement, false);
			}
			buf.putString('}\n');
		} else {
			buf.putString('\"' + DataModel.GetAttributeNameForType(AT_ELEMENT) + '\" \"')
			if (pElement) {
				Serialize(buf, pElement.getId());
			}
			buf.putChar('\"');
		}
	}

	#serializeElementArrayAttribute(buf: UtlBuffer, dict: DmElementSerializationDictionary, pAttribute: DmAttribute) {
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
			} else {
				//var pAttributeType = AttributeTypeName(AT_ELEMENT);
				buf.putString('\"' + DataModel.GetAttributeNameForType(AT_ELEMENT) + '\" \"')
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

	serializeArrayAttribute(buf: UtlBuffer, pAttribute: DmAttribute) {
		const array = pAttribute.getValue();

		buf.putString('\n[\n');
		buf.pushTab();

		const nCount = (array instanceof Array) ? array.length : 0;
		for (let i = 0; i < nCount; ++i) {
			if (pAttribute.getType() != AT_STRING_ARRAY) {
				buf.putChar('\"');
				buf.pushTab();
			}

			const attribute = array[i]
			//attribute.serialize(buf);
			if (pAttribute.getType() != AT_STRING_ARRAY) {
				//buf.putString(String(attribute));
				pAttribute.serializeIndex(i, buf);
			} else {
				buf.putDelimitedString(String(attribute));
			}
			//array.GetAttribute()->SerializeElement( i, buf );

			if (pAttribute.getType() != AT_STRING_ARRAY) {
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

	/**
	 *const char *pEncodingName, int nEncodingVersion,
			const char *pSourceFormatName, int nSourceFormatVersion,
			DmFileId_t fileid, DmConflictResolution_t idConflictResolution, CDmElement **ppRoot
	 */
	unserialize(/*bufferconst, encodingName, encodingVersion,
		sourceFormatName, sourceFormatVersion, fileId, idConflictResolution, root*/) {
	}
}
