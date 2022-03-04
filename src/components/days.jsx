// @flow
import cx from 'classnames'
import moment from 'moment'
import * as React from 'react'
import {forwardRef, Ref, useCallback} from 'react'
import styled from "styled-components";


const Day = styled.span`
  box-sizing: border-box !important;
  padding: 0 !important;
  width: 38px;
  height: 38px;

`
const DayButton = styled.button`
  box-sizing: border-box !important;
  position: relative;
  width: 38px;
  height: 38px;
`

const Carret = styled.span`
  z-index: 99999 !important;
  width: .7rem !important;
  height: .7rem !important;
`


const Row = forwardRef(({days, week}, ref) => <div ref={ref} data-row={week}
                                                   className="p-0 m-0"
                                                   data-week={week}>{days}</div>) // eslint-disable-line

const Cell = forwardRef(({
                             day,
                             month,
                             year,
                             data,
                             bg,
                             onRange = (e) => e,
                             onClick = (e) => e,
                             onChange
                         }, ref) => { // eslint-disable-line

    const handleSelectRange = useCallback((e) => {

        onRange({event: e, data})
        return e.preventDefault() && e.stopPropagation()
    }, [onRange, data])

    const handleClick = useCallback((e) => {

        onClick(data)
        return e.preventDefault() && e.stopPropagation()
    }, [onClick, data])

    return <Day ref={ref}
                data-day={day}
                data-month={month}
                data-year={year}
                onMouseEnter={handleSelectRange}>

        <DayButton type="button"
                   className={cx('btn btn-sm p-1 m-0 text-center', bg)}
                   onClick={handleClick}
                   onMouseEnter={handleSelectRange}>{day}</DayButton>
    </Day>
})

const SpecialCell = React.forwardRef(({
                                          day,
                                          month,
                                          year,
                                          data,
                                          bg,
                                          onClick = (e) => e,
                                          onRange = (e) => e,
                                          onChange
                                      }, ref) => { // eslint-disable-line

    const handleClick = useCallback((e) => {

        onClick(data)

        return e.preventDefault() && e.stopPropagation()

    }, [onClick, data])

    const handleSelectRange = useCallback((e) => {


        let result = new Promise((resolve) => {
            resolve({event: e, data})
        })

        onRange(result)

        return e.preventDefault() && e.stopPropagation()

    }, [onRange, data])

    //"p-5 text-end position-relative"
    return <Day ref={ref}
                data-day={day}
                data-month={month}
                data-year={year}
                onMouseEnter={handleSelectRange}>
        <DayButton type="button"
                   className={cx('btn btn-sm p-1 m-0 text-center', bg)}
                   data-day={day}
                   data-month={month}
                   data-year={year}
                   onClick={handleClick}
                   onMouseEnter={handleSelectRange}>
            {day}
            <Carret
                className="position-absolute top-1 start-75 translate-middle badge badge-circle badge-danger">&nbsp;</Carret>

        </DayButton>
    </Day>
})

const Days = forwardRef(({
                             date,
                             specialDays = [],
                             range = {
                                 start: [],
                                 middle: [],
                                 end: []
                             },
                             onChangeDay = (e) => e,
                             onRangeDate = (e) => e,
                             pos = ''
                         }, ref: Ref) => { // eslint-disable-line


    let week = 1

    let prevMonth = date.clone().subtract(1, 'month')

    let day = prevMonth.daysInMonth()

    prevMonth.date(day).startOf('week')

    let nextMonth = moment(prevMonth).clone().add(42, 'd')

    let weeks = []

    let days = []

    const onHandleClick = useCallback((e) => {

        onChangeDay(e)
    }, [onChangeDay])


    // if mouse is over a day, then highlight it then set range date list
    const onHandleRange = useCallback((e) => {
        if (range.start.length > 0 && range.end.length === 0) {

            onRangeDate(e.data)
        }

    }, [onRangeDate, range])

    while (prevMonth?.isBefore(nextMonth)) {

        let classes = {
            'text-bold': true,

            'text-dark': true,

            'rounded-5 fs-6': true,

            'text-center': true,


            'text-white text-inverse-info bg-info bg-hover-info indigo-900': specialDays.findIndex(
                d => d.day === prevMonth.date()
                    && d.month === prevMonth.month() + 1) >= 0,

            'bg-light-success text-success bg-hover-light-success text-hover-success': prevMonth.isSame(moment(), 'day'),

            'text-muted text-hover-primary bg-hover-light': (prevMonth.year() < date.year() || (prevMonth.year()
                    === date.year() && prevMonth.month() < date.month()))
                || (prevMonth.year() > date.year() || (prevMonth.year() === date.year() && prevMonth.month() > date.month())),

            'bg-hover-light-dark text-hover-dark p-1 fw-bold fw-6': true,

            // 'text-light-primary bg-primary active': range && selectedDate.length > 0 && selectedDate.findIndex(
            //   d => d.date() === prevMonth.date()) >= 0,

            // if selected first day then set bg-primary :pos === 'first'&&pos === 'second'
            'bg-active-dark text-active-inverse-dark rounded-0 rounded-start  active': range && range.start && range.start.findIndex(
                d => moment(d).date() === prevMonth.date() && prevMonth.month() === moment(d).month()) >= 0 && range.start.length === 1,

            'bg-active-dark text-active-inverse-dark rounded-0  rounded-end  active': range && range.end &&
                range.end.findIndex(
                    d => moment(d).date() === prevMonth.date() && prevMonth.month() === moment(d).month()) >= 0 && range.end.length === 1,

            'bg-active-secondary bg-opacity-5 text-active-inverse-secondary rounded-0 active': range
                && range.start
                && range.start.length > 0
                && range.middle.length > 0
                && range.middle.findIndex(d => moment(d).date() === prevMonth.date() && prevMonth.month() === moment(d).month()) >= 0,
        }

        if (specialDays.findIndex(d => d.day === prevMonth.date() && d.month === prevMonth.month() + 1) >= 0) {

            days.push(<SpecialCell
                day={prevMonth.date()}
                year={prevMonth.year()}
                month={prevMonth.month()}
                key={prevMonth.month() + '-' + prevMonth.date()}
                data={prevMonth.clone()}
                bg={cx(classes)}
                onRange={onHandleRange}
                onClick={onHandleClick}/>)

        } else {
            days.push(<Cell
                day={prevMonth.date()}
                year={prevMonth.year()}
                month={prevMonth.month()}
                key={prevMonth.month() + '-' + prevMonth.date()}
                bg={cx(classes)}
                data={prevMonth.clone()}
                onRange={onHandleRange}
                onClick={onHandleClick}/>)
        }

        if (prevMonth.weekday() === moment().endOf('week').weekday()) {

            weeks.push(<Row days={days}
                            key={prevMonth.month() + '-' + prevMonth.date()}
                            week={prevMonth.month() + '-' + week}/>)

            days = []

            week++
        }

        prevMonth.add(1, 'd')

    }

    return <>{weeks && weeks}</>
})

export default Days
