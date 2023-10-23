export async function GET(req: Request, res: Request) {
    const { searchParams } = new URL(req.url);
    const requestID = searchParams.get('requestID');

    const 

    const result = {
        
    };


    return Response.json(result);
}