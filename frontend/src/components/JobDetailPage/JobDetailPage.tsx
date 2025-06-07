import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

function JobDetailPage() {
    const jobId = useParams();



    useEffect(() => {
        console.log(jobId);
    })


    return (
        <div>
            <h1>Detail</h1>
        </div>
    )
}

export default JobDetailPage;