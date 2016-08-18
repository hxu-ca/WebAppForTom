angular.module('app.client', ['angular-loading-bar'])
.controller('clientVM', ["$scope", "$http", "$filter", function ($scope, $http, $filter) {
    $scope.Status = {
        NewForm: false,
        EditForm: false,
        ClientId: '',
        UserName: '',
        AccessFailedCount: '',
    };

    $scope.Client = {
        new: {},
        selected: null,
        existing: [],
    };

    $http.get($scope.servicePath + '?adminName=' + $scope.userName)
        .success(function (data) {
            $scope.Client.existing = data;
        })
        .error(function (data, status, headers, config) {
            console.log("Get User list fialed! " + data.Message + '-' + data.ExceptionMessage)
        });
    // event handlers

    $scope.ShowNewForm = function () {
        $scope.Status.NewForm = true;
        $scope.Status.EditForm = false;
    }
    $scope.Edit = function (id) {
        $scope.Status.EditForm = true;
        $scope.Status.NewForm = false;
        // one way I didn't mark it
        $scope.Client.selected = $filter('filter')($scope.Client.existing, { Id: id })[0];
        // or
        // another way. call get User in order to call GetUser. 
        $http.get($scope.servicePath + 'GetUser?id=' + id)
            .success(function (data) {
                $scope.Client.selected = data;
            })
            .error(function (data, status, headers, config) {
                console.log("Get User list fialed! " + data.Message + '-' + data.ExceptionMessage)
            });
    }

    $scope.Update = function () {
        if ($scope.Client.selected.UserName == "") {
            $scope.Status.UserName = "User Name is reqired!";
            return;
        }
        if ($scope.Client.selected.AccessFailedCount == "") {
            $scope.Status.AccessFailedCount = "Failed Count is reqired!";
            return;
        }
        $http.put($scope.servicePath + 'PutUser', $scope.Client.selected)
        .success(function (data) {
            $scope.Status.EditForm = false;
            var t = $filter('filter')($scope.Client.existing, { Id: $scope.Client.selected.Id })[0];
            var i = $scope.Client.existing.indexOf(t);
            $scope.Client.existing.splice(i, 1);
            $scope.Client.existing.push($scope.Client.selected);
        })
        .error(function (data, status, headers, config) {
            console.log("Get User list fialed! " + data.Message + '-' + data.ExceptionMessage)
        });
    }
    $scope.Remove = function (id) {
        $http.delete($scope.servicePath + 'DeleteUser?id=' + id)
            .success(function (data) {
                if (data) {
                    var t = $filter('filter')($scope.Client.existing, { Id: data.Id })[0];
                    if (t != null) {
                        var i = $scope.Client.existing.indexOf(t);
                        $scope.Client.existing.splice(i, 1);
                    }
                }
            })
            .error(function (data, status, headers, config) {
                console.log("Get User list fialed! " + data.Message + '-' + data.ExceptionMessage)
        });
    }
    $scope.New = function () {
        // just simply validation
        if ($scope.Client.new.Id == "") {
            $scope.Status.ClientId = "Id is reqired!";
            return;
        }
        if ($scope.DuplicateId($scope.Client.new.Id)) {
            $scope.Status.ClientId = "Id is existing!";
            return;
        }
        if ($scope.Client.new.UserName == "") {
            $scope.Status.UserName = "User Name is reqired!";
            return;
        }
        if ($scope.Client.new.AccessFailedCount == "") {
            $scope.Status.AccessFailedCount = "Failed Count is reqired!";
            return;
        }
        $http.post($scope.servicePath + 'PostUser', $scope.Client.new)
            .success(function (data) {
                $scope.Client.existing.push($scope.Client.new);
                $scope.Client.new = {};
                $scope.Status.NewForm = false;
            })
            .error(function (data, status, headers, config) {
            console.log("Get User list fialed! " + data.Message + '-' + data.ExceptionMessage)
        });
    }
    $scope.CancelAdd = function () {
        // Her just simple hide it. you can add code to do clean up
        $scope.Status.NewForm = false;
    }
    $scope.CancelEdit = function () {
        // Her just simple hide it. you can add code to do something else
        $scope.Status.EditForm = false;
    }

    //helper function
    $scope.DuplicateId = function (id) {
        var t = $filter('filter')($scope.Client.existing, { Id: id })[0];
        return t != null;
    }
}])