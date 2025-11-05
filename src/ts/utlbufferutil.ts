import { UniqueId } from './uniqueid';
import { UtlBuffer } from './utlbuffer';


export function Serialize(buf: UtlBuffer, src: UniqueId): void {
	if (buf instanceof UtlBuffer) {
		switch (true) {
			case src instanceof UniqueId:
				src.Serialize(buf);
				break;
			//TODO
			default:
				console.error('Serialization of this type not impemented', src);
		}
	} else {
		console.error('buffer not instance of UtlBuffer');
	}
}

//void SetSerializationDelimiter( CUtlCharConversion *pConv )
export function SetSerializationDelimiter(): void {
	//TODO
}

//void SetSerializationArrayDelimiter( const char *pDelimiter )
export function SetSerializationArrayDelimiter(): void {
	//TODO
}


/*
{
// X360TBD: Need a real UUID Implementation
#ifdef IS_WINDOWS_PC
	if ( buf.IsText() )
	{
		UUID *pId = ( UUID * )&src;

		unsigned char *outstring = NULL;

		UuidToString( pId, &outstring );
		if ( outstring && *outstring )
		{
			buf.PutString( (const char *)outstring );
			RpcStringFree( &outstring );
		}
		else
		{
			buf.PutChar( '\0' );
		}
	}
	else
	{
		buf.Put( &src, sizeof(UniqueId_t) );
	}
	return buf.IsValid();
#else
	return false;
#endif
*/
