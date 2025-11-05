import { AttributeTypeName } from './dmattribute';
import { DmElement } from './dmelement';
import { UniqueId } from './uniqueid';

const UNNAMED_ELEMENT_NAME = 'unnamed';
export class DataModel {
	static m_Handles = 0;

	static GetAttributeNameForType(attType: number/*TODO: improve type*/): string {
		return AttributeTypeName(attType);
	}

	/*
	var GetAttributeTypeForName (name) {
		return AttributeType(name);
	}
	*/

	static acquireElementHandle(): number {
		return ++this.m_Handles;
	}

	//CDmElement* CDataModel::CreateElement( const DmElementReference_t &ref, const char *pElementType, const char *pElementName, DmFileId_t fileid, const DmObjectId_t *pObjectID )
	static createElement(ref: undefined, pElementType: string, pElementName?: string, fileid?: never, pObjectID?: UniqueId): DmElement {
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

	static createElementNew(pElementType: string, pElementName: string): DmElement {
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
