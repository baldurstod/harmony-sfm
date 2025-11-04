const conversionArray: Record<string, string> = {
	'\n': 'n',
	'\t': 't',
	'\v': 'v',
	'\b': 'b',
	'\r': 'r',
	'\f': 'f',
	//'\a' : 'a',
	'\\': '\\',
	'\?': '\?',
	'\'': '\'',
	'\"': '\"'
};

export class UtlBuffer {
	//var TEXT_BUFFER = 0x1;			// Describes how get + put work (as strings, or binary)
	//var EXTERNAL_GROWABLE = 0x2;	// This is used w/ external buffers and causes the utlbuf to switch to reallocatable memory if an overflow happens when Putting.
	//var CONTAINS_CRLF = 0x4;		// For text buffers only, does this contain \n or \n\r?
	//var READ_ONLY = 0x8;			// For external buffers; prevents null termination from happening.
	//var AUTO_TABS_DISABLED = 0x10;	// Used to disable/enable push/pop tabs
	#m_Error = 0;
	#m_Flags: number;
	#m_nTab = 0;
	#buffer: string[] = [];

	constructor(flags: number) {
		this.#m_Flags = flags;

	}

	isText() {
		return (this.#m_Flags & BufferFlags.TEXT_BUFFER) != 0;
	}

	pushTab() {
		++this.#m_nTab;
	}

	popTab() {
		if (--this.#m_nTab < 0) {
			this.#m_nTab = 0;
		}
	}

	#wasLastCharacterCR() {
		if (!this.isText()) {
			return false;
		}
		const lastString = this.#buffer[this.#buffer.length - 1];
		return (lastString.substring(lastString.length - 1) == '\n');
	}

	#putTabs() {
		const nTabCount = (this.#m_Flags & BufferFlags.AUTO_TABS_DISABLED) ? 0 : this.#m_nTab;
		for (let i = nTabCount; --i >= 0;) {
			this.#putTypeBinChar('\t');
		}
	}

	#bufferPush(c: string) {
		if (c.length) {
			this.#buffer.push(c);
		}
	}

	#putTypeBinChar(c: string) {
		this.#bufferPush(c);
	}

	putChar(c: string) {
		if (this.#wasLastCharacterCR()) {
			this.#putTabs();
		}
		this.#bufferPush(c);
	}

	#put(s: string, size: number) {
		this.#bufferPush(s.substring(0, size));
	}

	putString(s: string) {
		if (!this.isText()) {
			if (s) {
				this.#bufferPush(s);
			} else {
				this.#bufferPush('\0');
			}
		} else {
			const nTabCount = (this.#m_Flags & BufferFlags.AUTO_TABS_DISABLED) ? 0 : this.#m_nTab;
			if (nTabCount > 0) {
				if (this.#wasLastCharacterCR()) {
					this.#putTabs();
				}

				//const char* pEndl = strchr( string, '\n' );
				let pEndl = s.indexOf('\n');
				while (pEndl != -1) {
					const nSize = pEndl + 1;//(size_t)pEndl - (size_t)string + sizeof(char);
					this.#put(s, nSize);
					s = s.substring(pEndl + 1);
					if (s.length) {
						this.#putTabs();
						pEndl = s.indexOf('\n');
					} else {
						pEndl = -1;
					}
				}
			}
			this.#bufferPush(s);
		}
	}

	#putDelimitedCharInternal(c: string) {
		const l = conversionArray[c];//pConv->GetConversionLength( c );
		if (!l) {
			this.putChar(c);
		} else {
			this.putChar('\\'/* pConv->GetEscapeChar() */);
			this.#put(l, 1);
		}
	}

	putDelimitedString(s: string) {
		if (typeof s != 'string') {
			s = '';
		}

		if (!this.isText()) {
			this.putString(s);
			return;
		}

		if (this.#wasLastCharacterCR()) {
			this.#putTabs();
		}
		this.#put('\"', 1);//Put( pConv->GetDelimiter(), pConv->GetDelimiterLength() );

		const nLen = s.length; //? Q_strlen( string ) : 0;
		for (let i = 0; i < nLen; ++i) {
			this.#putDelimitedCharInternal(s[i]);
		}

		if (this.#wasLastCharacterCR()) {
			this.#putTabs();
		}
		this.#put('\"', 1);//Put( pConv->GetDelimiter(), pConv->GetDelimiterLength() );
	}

	isValid() {
		return this.#m_Error == 0;
	}

	getBuffer() {
		return this.#buffer.join('');
	}
}

export enum SeekType {
	SEEK_HEAD = 0,
	SEEK_CURRENT = 1,
	SEEK_TAIL = 2,

};

export enum BufferFlags {
	TEXT_BUFFER = 0x1,
	EXTERNAL_GROWABLE = 0x2,
	CONTAINS_CRLF = 0x4,
	READ_ONLY = 0x8,
	AUTO_TABS_DISABLED = 0x10,
};
