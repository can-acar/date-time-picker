// @flow

import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import moment from "moment";
import Days from "./days";
//styled-components
import styled from "styled-components";

const LabelSpan = styled.span`
  box-sizing: border-box !important;
  width: 38px !important;
`;

const DayItem = styled.div`
  box-sizing: border-box !important;
  width: 38px !important;
  height: 38px !important;
`;

const HeadTitle = forwardRef(({

                                  onChangeYear,
                                  onChangeMonth,
                                  date,
                                  locale,
                              }, ref) => {

    const months = useMemo(() => moment.localeData(locale).months(), [locale])


    return (<div ref={ref}
                 className="d-flex flex-fill align-content-stretch justify-content-between mb-5">
        <div className="d-flex flex-stack">
            <div className="d-flex flex-column">
                                        <span
                                            className="fs-5 text-dark text-hover-primary fw-bolder">
                                            {date.format('MMMM YYYY')}
                                        </span>
            </div>
        </div>
        <div className="d-flex flex-stack">
            <div className="d-flex justify-content-end">
                <div
                    className="input-group input-group-sm w-150px text-end">
                    <input type="number"
                           className="form-control form-control-sm form-control-solid"
                           value={date.format('YYYY')}
                           placeholder="Yıllar"
                           aria-label="year"
                           onChange={onChangeYear}

                    />
                    <select name="month" id="month"
                            value={date.months()}
                            className="form-control form-control-sm form-control-solid"
                            onChange={onChangeMonth}>
                        {months.map((o, i) => <option
                            key={i}
                            value={i}>{o}</option>)}
                    </select>
                </div>
            </div>
        </div>
    </div>)
})

const Navigation = forwardRef(({
                                   date,
                                   onPrev,
                                   onNext,
                                   onPrevYear,
                                   onNextYear,
                               }, ref) => {

    const onHandlePrev = useCallback((e) => {
        e.preventDefault() && e.stopPropagation()
        let prevDate = moment(date).add(-1, 'month')
        onPrev(prevDate)


    }, [date])

    const onHandleNext = useCallback((e) => {
        e.preventDefault() && e.stopPropagation()

        let nextDate = moment(date).add(1, 'month')
        onNext(nextDate)

    }, [date])

    const onHandlePrevYear = useCallback((e) => {
        e.preventDefault() && e.stopPropagation()
        let prevDate = moment(date).add(-1, 'year')
        onPrevYear(prevDate)

    }, [date])

    const onHandleNextYear = useCallback((e) => {
        e.preventDefault() && e.stopPropagation()
        let nextDate = moment(date).add(1, 'year')
        onNextYear(nextDate)

    }, [date])

    let displayDate = moment(date).format('MMMM YYYY')

    return <div className="d-flex flex-stack justify-content-center mb-3"
                ref={ref}>
      <span className="prev available">
        <a
            onClick={onHandlePrevYear}
            className="text-dark fw-bolder text-hover-primary bg-hover-light p-3 rounded-2 fs-6">
          <i className="bi bi-chevron-double-left"/>
        </a>
      </span>
        <span className="prev available">
        <a onClick={onHandlePrev}
           className="text-dark fw-bolder text-hover-primary bg-hover-light p-3 rounded-2 fs-6">
          <i className="bi bi-chevron-left"/>
        </a>
      </span>
        <div className="text-center">
            <span className="fw-bolder text-dark">{displayDate}</span>
        </div>
        <span className="next available">
        <a onClick={onHandleNext}
           className="text-dark fw-bolder text-hover-primary bg-hover-light p-3 rounded-2 fs-6"><i
            className="bi bi-chevron-right"/>
        </a>
      </span>
        <span className="next available">
        <a
            onClick={onHandleNextYear}
            className="text-dark fw-bolder text-hover-primary bg-hover-light p-3 rounded-2 fs-6"><i
            className="bi bi-chevron-double-right"/>
        </a>
      </span>
    </div>

})

const DaysLabel = forwardRef(({labels = []}, ref) => {


    const label = ((day, i) => <DayItem key={i}
                                        className="ps-1 me-0 text-center">
        <LabelSpan

            className={'fw-bolder text-dark text-justify'}
            data-label={day}>{day}
        </LabelSpan>
    </DayItem>)

    return <div className="d-flex flex-stack" ref={ref}>{labels.map(label)}</div>
})

const Picker = forwardRef((props, ref) => {
    const {
        range,
        locale,
        pos = 'first',
        // eslint-disable-next-line no-unused-vars
        specialDays = [],
        onChange,
        onRangeDate
    } = props;

    const picker = useRef(null)
    const daysRef = useRef(null)

    const [date, changeDate] = useState(moment(new Date()))

    const onHandleDayChange = useCallback((e) => {

        onChange(e)
    }, [onChange])

    const onHandleYearChange = useCallback((e) => {
        e.preventDefault() && e.stopPropagation()

        if (e.target.value < 0) {
            return
        }

        let prevDate = moment(date).set('year', e.target.value)

        changeDate(prevDate)

    }, [changeDate, date])

    const onHandleMonthChange = useCallback((e) => {

        e.preventDefault() && e.stopPropagation()

        let prevDate = moment(date).set('month', e.target.value)

        changeDate(prevDate)

    }, [changeDate, date])


    useEffect(() => {

        if (pos) {

            //label switch case and default
            let positions = {
                ['first']: (date) => date,
                ['second']: (date) => moment(date).add('1', "month")
            }

            let prevDate = positions[pos](date)

            changeDate(prevDate)
        }

    }, [pos])


    const dayLabels = useMemo(() => {
        moment.locale(locale)
        return moment.weekdaysShort(true)
    }, [locale])
console.log(specialDays)
    return (
        <div
            className="d-flex flex-column align-items-around ps-3 pn-3 pt-3"
            ref={picker}>
            <HeadTitle
                locale={locale}
                onChangeYear={onHandleYearChange}
                onChangeMonth={onHandleMonthChange}
                date={date}/>
            <Navigation
                date={date}
                onPrev={changeDate}
                onNext={changeDate}
                onPrevYear={changeDate}
                onNextYear={changeDate}
            />
            <div
                className="d-flex align-items-start align-content-center flex-wrap">
                <DaysLabel labels={dayLabels}/>
                <Days ref={daysRef}
                      date={date}
                      range={range}
                      pos={pos}
                      onChangeDay={onHandleDayChange}
                      onRangeDate={onRangeDate}
                      specialDays={specialDays}/>
            </div>
        </div>
    );
});

export default Picker
