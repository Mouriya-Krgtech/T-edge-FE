import React, { useEffect } from 'react'
import { useLoading } from '../context/LoadingContext'

const LiveDisplay = () => {
    const {setLoading} = useLoading();

        useEffect(() => {
          setLoading(true); // Start loading when component mounts
      
          // Simulate fetching data (replace with actual API call if needed)
          setTimeout(() => {
            setLoading(false); // Stop loading when data is ready
          }, 1000); // Adjust timing as needed
        }, [setLoading]);

  return (
    <>
        <div className="content-wrapper">
            <div class="col-md-12 grid-margin stretch-card">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Live Display </h4>
                        <div class="table-responsive">
                            <table class="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                    <th>offset </th>
                                    <th>0 </th>
                                    <th>1 </th>
                                    <th>2 </th>
                                    <th>3 </th>
                                    <th>4 </th>
                                    <th>5 </th>
                                    <th>6 </th>
                                    <th>7 </th>
                                    <th>8 </th>
                                    <th>9 </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>10</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                    </tr>
                                    <tr>
                                        <td>20</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                    </tr>
                                    <tr>
                                        <td>30</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                        <td>0.000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </>
  )
}

export default LiveDisplay