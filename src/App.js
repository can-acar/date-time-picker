// @flow

import React, {useEffect, useState} from 'react';
import DateRangePicker from "./components/date-range-picker";
import moment from "moment";
import 'moment/locale/tr'

moment.locale('tr')

function App() {
    // use state component is mount
    const [isMounted, setIsMounted] = useState(false);


    // preload body
    useEffect(() => {
        if (!isMounted) {

            document.body.style.opacity = 0.5;
            // if component is mounted, add class to body

            setIsMounted(true);
        }

        if (isMounted) {
            document.body.style.opacity = 1;
            document.body.classList.add('is-mounted', 'bg-light');
            document.getElementById('root').classList.add('col-lg-8', 'mx-auto', 'p-3', 'py-md-5', 'p-3');
        }
        return () => {
            document.body.style.opacity = 0.5;
        }
    }, [isMounted]);


    return (<>

            <header className="d-flex align-items-center pb-3 mb-5 border-bottom">
                <div className="d-flex align-items-center text-dark text-decoration-none">
                    <span className="fs-4">Date Time & Date Range Picker</span>
                </div>
            </header>
            <main>

                <form>
                    <div className="form-group">
                        <label htmlFor="date">Date Range</label>

                        <DateRangePicker id={'date_time_example'}
                                         format={"DD.MM.YYYY"}
                                         name={'date_time_example'}
                                         specialDays={[{
                                             day: 14,
                                             month: 2,
                                             memo: 'Sevgililer Bayramı'
                                         }, {
                                             day: 15,
                                             month: 2,
                                             memo: ' Mayış Bayramı'
                                         },
                                             {
                                                 day: 1,
                                                 month: 4,
                                                 memo: ' 1 Nisan Şaka Bayramı'
                                             }
                                         ]}
                                         locale={'tr'}/>
                    </div>
                </form>

            </main>
        </>
    );
}

export default App;
