export default function LoaderPage(){

    return(
        <>
          <div className="flex justify-center items-center text-blue-700 text-2xl gap-1 py-5">
            <Loader2 size={40} className="animate-spin" /> Loading...
          </div>
        </>
    )
}

