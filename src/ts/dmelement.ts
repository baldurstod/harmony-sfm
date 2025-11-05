import { DmAttribute, DmAttributeValue } from './dmattribute';
import { DmAttributeType } from './dmattributetypes';
import { DmElementReference } from './dmelementreference';
import { UniqueId } from './uniqueid';
export * from './dmattributetypes2';

/**
 *
 */
/*
CDmElement::CDmElement( DmElementHandle_t handle, const char *pElementType, const DmObjectId_t &id, const char *pElementName, DmFileId_t fileid ) :
	m_ref( handle ), m_Type( g_pDataModel->GetSymbol( pElementType ) ), m_fileId( fileid ),
	m_pAttributes( NULL ), m_bDirty( false ), m_bBeingUnserialized( false ), m_bIsAcessible( true )
*/

const DMELEMENT_HANDLE_INVALID = -1;
export class DmElement {
	isDmElement = true as const;
	m_pAttributes: DmAttribute | null = null;
	m_ref: DmElementReference
	m_Type: string;
	#m_bDirty = false;
	m_bBeingUnserialized = false;
	m_bIsAcessible = true;
	m_Id: UniqueId;
	m_fileId?: never;

	constructor(handle: number, pElementType: string, id: UniqueId, pElementName: string, fileid?: never) {
		this.m_ref = new DmElementReference(handle);
		this.m_Type = pElementType//DataModel.GetSymbol(pElementType);//TODO

		this.m_Id = id;
		this.m_fileId = fileid;

		this.createAttribute('name', DmAttributeType.String, pElementName);
	}

	//CDmAttribute *CDmElement::CreateAttribute( const char *pAttributeName, DmAttributeType_t type )
	createAttribute(attributeName: string, attributeType: DmAttributeType, attributeValue?: DmAttributeValue | null): DmAttribute | null {
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
			attribute.setValue(attributeValue);
		}

		//g_pDataModelImp->NotifyState( NOTIFY_CHANGE_TOPOLOGICAL );
		return attribute;
	}

	hasAttribute(attributeName: string, attributeType: DmAttributeType): boolean {
		//attributeType = typeof attributeType !== 'undefined' ? attributeType : DmAttributeType.Unknown;

		const attribute = this.findAttribute(attributeName);
		if (!attribute) {
			return false;
		}
		return (attributeType == DmAttributeType.Unknown || (attribute.type == attributeType));
	}

	findAttribute(attributeName: string): DmAttribute | null {
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

	setAttributeValue(attributeName: string, value: any): void {
		if (this.m_pAttributes) {
			const attribute = this.m_pAttributes.findAttribute(attributeName);
			if (attribute) {
				attribute.setValue(value);
			}
		}
	}

	markDirty(): void {
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


	getHandle(): number {
		if (this.m_ref.elementHandle == DMELEMENT_HANDLE_INVALID) {
			console.error('Invalid handle');
			//TODO
		}
		return this.m_ref.elementHandle;
	}

	getId(): UniqueId {
		return this.m_Id;
	}

	firstAttribute(): DmAttribute | null {
		return this.m_pAttributes;
	}

	getTypeString(): string {
		return this.m_Type;//DataModel.getString( m_Type );TODO
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
