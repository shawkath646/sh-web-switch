import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function GET(req: Request, res: Response) {

    const { searchParams } = new URL(req.url)
    const documentId = searchParams.get('id')

    let result = {};


    if (documentId) {
        const docRef = doc(db, 'siteinfo', documentId);

        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                result = docSnapshot.data();
                console.log('Document data:', result);
            } else {
                return Response.json({ error: "Site ID is not assigned in Server." }, { status: 404 });
            }
        } catch (error) {
            return Response.json({ error: "Internal error" }, { status: 400 });
        }
    } else {
        return Response.json({ error: "Blank or invalid ID provided" }, { status: 400 });
    }

    return Response.json(result);
}