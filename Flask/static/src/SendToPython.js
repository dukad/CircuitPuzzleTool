export default function SendToPython(net) {
        jQuery.ajax({
            type: 'POST',
            url: "/opa",
            data: { // parameters to send into python
                netlist: net
            },
            success: function (response) {
                console.log(response);
            }
        })
            // .done(function (data) { // data is what is returned by python
            //     // do something
            //     console.log(data)
            //     console.log(typeof data)
            // })
}

