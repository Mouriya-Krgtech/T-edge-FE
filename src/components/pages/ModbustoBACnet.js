import React from 'react'

const ModbustoBACnet = () => {
  return (
    <>
        <div class="content-wrapper">
            <div class="row">
            <div class="col-8 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Configuration Form</h4>
                    <form class="forms-sample material-form">
                      <div class="form-group">
                        <input type="text" required="required" />
                        <label for="input" class="control-label">Name</label><i class="bar"></i>
                      </div>
                      <div class="form-group">
                        <input type="file" required="required" />
                        <label for="input" class="control-label"></label><i class="bar"></i>
                      </div>
                      
                      
                      <div class="button-container">
                        <button type="button" class="btn btn-outline-primary btn-sm me-2"><span>Submit</span></button>
                        <button type="button" class="btn btn-lg btn-outline-warning"><span>Cancel</span></button>
                      
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </>
  )
}

export default ModbustoBACnet