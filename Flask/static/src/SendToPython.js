import DisplayValues from "./dispay_values.js";

export default function SendToPython(net, node_list, comp_list) {
        $.ajax({
            // async: false,
            type: 'POST',
            url: "/opa",
            data: { // parameters to send into python
                netlist: net
            },
            success: function (response) {
                // $.resolve(response)
                // console.log(response)
                console.log('succeeded')
                // console.log(typeof response)
                // console.log(response)
                DisplayValues(response, node_list, comp_list)
                return response
            }
        })
}


