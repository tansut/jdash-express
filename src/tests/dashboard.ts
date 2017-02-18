import * as request from 'request';
import Helper from './helper';
import * as jcore from 'jdash-core';

export default function () {
    describe('dashboard', function () {
        var newDashboardId: string;
        it('should create a dashboard', function () {
            var newDashboard: jcore.DashboardCreateModel = {
                title: 'Foo title',
                description: 'eewrew',
                id: "",
                user: "xxx"
            }
            return Helper.request('/dashboard/create', {
                method: 'POST',
                json: true,
                body: newDashboard
            }).then(result => {
                newDashboardId = result;
            })
        });
        it('should get a dashboard', function () {
            return Helper.request('/dashboard/111', {
                method: 'GET',
                json: true
            }).then(result => {

            })
        });
    });
}