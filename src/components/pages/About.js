import React, { useEffect } from 'react'
import { useLoading } from '../context/LoadingContext';

const About = () => {
    const { setLoading } = useLoading();

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
        <div class="col-md-8 grid-margin stretch-card">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title">SIXDIME EDGEBOX Details </h4>
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                <th>Name </th>
                                <th>Value </th>
                                </tr>
                            </thead>
                            <tbody >
                                <tr>
                                <td className='fw-bold'>Driver Configuration </td>
                                <td>DCC000</td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>DCC Version</td>
                                <td>V6.0.5p (A)</td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>Kernel Version</td>
                                <td>V6.51c (D)</td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>Release Status</td>
                                <td>Normal</td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>Build Revision</td>
                                <td>6.2.1</td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>Build Date</td>
                                <td>03-03-2025 </td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>BIOS Version</td>
                                <td>4.1.2</td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>FieldServer Model</td>
                                <td>FPC-N54</td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>Carrier Type</td>
                                <td>-</td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>Serial Type</td>
                                <td>21466279</td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>Data Point Used</td>
                                <td>30</td>
                                </tr>
                                <tr>
                                <td className='fw-bold'>Data Point Max</td>
                                <td> 500 </td>
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

export default About