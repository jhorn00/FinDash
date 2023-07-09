import React from "react";

export function Idk() {
  return (
    <div className="col-md-12 col-lg-6">
      <div className="mb-3 card">
        <div className="card-header-tab card-header">
          <div className="card-header-title">
            <i className="header-icon lnr-rocket icon-gradient bg-tempting-azure">
              {" "}
            </i>
            Bandwidth Reports
          </div>
          <div className="btn-actions-pane-right">
            <div className="nav">
              <a
                href="#"
                className="border-0 btn-pill btn-wide btn-transition active btn btn-outline-alternate"
              >
                Tab 1
              </a>
              <a
                href="#"
                className="ml-1 btn-pill btn-wide border-0 btn-transition  btn btn-outline-alternate second-tab-toggle-alt"
              >
                Tab 2
              </a>
            </div>
          </div>
        </div>
        <div className="tab-content">
          <div className="tab-pane fade active show" id="tab-eg-55">
            <div className="widget-chart p-3">
              <canvas id="line-chart"></canvas>
            </div>
            <div className="widget-chart-content text-center mt-5">
              <div className="widget-description mt-0 text-warning">
                <i className="fa fa-arrow-left"></i>
                <span className="pl-1">175.5%</span>
                <span className="text-muted opacity-8 pl-1">
                  increased server resources
                </span>
              </div>
            </div>
          </div>
          <div className="pt-2 card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="widget-content">
                  <div className="widget-content-outer">
                    <div className="widget-content-wrapper">
                      <div className="widget-content-left">
                        <div className="widget-numbers fsize-3 text-muted">
                          63%
                        </div>
                      </div>
                      <div className="widget-content-right">
                        <div className="text-muted opacity-6">
                          Generated Leads
                        </div>
                      </div>
                    </div>
                    <div className="widget-progress-wrapper mt-1">
                      <div className="progress-bar-sm progress-bar-animated-alt progress">
                        <div
                          className="progress-bar bg-danger"
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="widget-content">
                  <div className="widget-content-outer">
                    <div className="widget-content-wrapper">
                      <div className="widget-content-left">
                        <div className="widget-numbers fsize-3 text-muted">
                          32%
                        </div>
                      </div>
                      <div className="widget-content-right">
                        <div className="text-muted opacity-6">
                          Submitted Tickers
                        </div>
                      </div>
                    </div>
                    <div className="widget-progress-wrapper mt-1">
                      <div className="progress-bar-sm progress-bar-animated-alt progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="widget-content">
                  <div className="widget-content-outer">
                    <div className="widget-content-wrapper">
                      <div className="widget-content-left">
                        <div className="widget-numbers fsize-3 text-muted">
                          71%
                        </div>
                      </div>
                      <div className="widget-content-right">
                        <div className="text-muted opacity-6">
                          Server Allocation
                        </div>
                      </div>
                    </div>
                    <div className="widget-progress-wrapper mt-1">
                      <div className="progress-bar-sm progress-bar-animated-alt progress">
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="widget-content">
                  <div className="widget-content-outer">
                    <div className="widget-content-wrapper">
                      <div className="widget-content-left">
                        <div className="widget-numbers fsize-3 text-muted">
                          41%
                        </div>
                      </div>
                      <div className="widget-content-right">
                        <div className="text-muted opacity-6">
                          Generated Leads
                        </div>
                      </div>
                    </div>
                    <div className="widget-progress-wrapper mt-1">
                      <div className="progress-bar-sm progress-bar-animated-alt progress">
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
