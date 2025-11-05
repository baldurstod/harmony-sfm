import { FATTRIB_DONTSAVE } from './attributeflags';
import { DmAttributeType } from './dmattributetypes';
import { DmElement } from './dmelement';

export const ELEMENT_DICT_HANDLE_INVALID = -1;

class ElementInfo {
	m_bRoot = false;
	m_pElement?: DmElement;
}

export class DmElementSerializationDictionary {
	root = null;
	element = null;
	m_Dict: Record<string, ElementInfo> = {};
	m_Dict2: number[] = [];

	//void BuildElementList( CDmElement *pRoot, bool bFlatMode );
	buildElementList(root: DmElement, flatMode: boolean) {
		this.#buildElementList_R(root, flatMode, true);
	}

	// Should I inline the serialization of this element?
	//bool ShouldInlineElement( CDmElement *pElement );
	shouldInlineElement(element: DmElement) {
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
			if (this.m_Dict[this.m_Dict2[h]!]?.m_bRoot) {
				return h;
			}
		}
		return ELEMENT_DICT_HANDLE_INVALID;
	}

	//DmElementDictHandle_t NextRootElement( DmElementDictHandle_t h ) const;
	nextRootElement(h: number) {
		++h;
		const nCount = this.m_Dict2.length;
		for (; h < nCount; h++) {
			if (this.m_Dict[this.m_Dict2[h]!]?.m_bRoot) {
				return h;
			}
		}
		return ELEMENT_DICT_HANDLE_INVALID;
	}

	//CDmElement* GetRootElement( DmElementDictHandle_t h );
	getRootElement(h: number) {
		return this.m_Dict[this.m_Dict2[h]!]?.m_pElement;
	}

	// Finds the handle of the element
	//DmElementDictHandle_t Find( CDmElement *pElement );
	find(pElement: DmElement) {
		console.error('fixme');
		//TODO
	}

	// How many root elements do we have?
	//int RootElementCount() const;
	rootElementCount() {
		console.error('fixme');
		//TODO
	}

	addElement(element: DmElement, isRoot: boolean) {
		const handle = element.getHandle();
		const info = new ElementInfo();
		info.m_bRoot = isRoot;
		info.m_pElement = element;

		this.m_Dict[handle] = info;
		this.m_Dict2.push(handle);
	}

	//void BuildElementList_R( CDmElement *pElement, bool bFlatMode, bool bIsRoot );
	#buildElementList_R(pElement: DmElement, bFlatMode: boolean, bIsRoot: boolean) {
		if (!pElement) { return; }
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
						const pChild = pAttribute.getValue() as DmElement;
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
								const pChild = array[i] as DmElement;
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
