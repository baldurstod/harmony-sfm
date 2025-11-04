import { DmAttributeList } from './dmattributelist';

const DMELEMENT_HANDLE_INVALID = -1;

export class DmElementReference {
	elementHandle: number;
	m_nWeakHandleCount: number;
	m_nStrongHandleCount: number;
	m_attributes = new DmAttributeList();

	constructor(handle: number) {
		this.elementHandle = typeof handle === 'number' ? handle : DMELEMENT_HANDLE_INVALID;

		this.m_nWeakHandleCount = 0;		// CDmeHandle<T> - for auto-hookup once the element comes back, mainly used by UI
		this.m_nStrongHandleCount = 0;	// CDmeCountedElementRef - for preventing elements from being truly deleted, mainly used by undo and file root
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
