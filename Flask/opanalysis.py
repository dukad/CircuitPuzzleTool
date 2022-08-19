import PySpice
from PySpice.Unit import *
import PySpice.Logging.Logging as Logging
from PySpice.Spice.Netlist import Circuit

def opanalysis(netlist):
    print('running opanalysis')
    circuit = Circuit('Circuit Puzzle Tool')
    print('circuit created')
    logger = Logging.setup_logging()
    print('logger created')
    nodes_set = set()
    resistors = set()
    lines = netlist.split('\n')
    print('line 13')
    for line in lines:
        words = line.split(' ')
        try:
            node1 = words[1]
            node2 = words[2]

            if words[1] == '0':
                node1 = circuit._ground
            if words[2] == '0':
                node2 = circuit._ground

            nodes_set.add(node1)
            nodes_set.add(node2)

            if line[0] == 'R':
                resistors.add(circuit.R(words[0][1:], node1, node2, int(words[3]) @ u_Ohm))
            elif line[0] == 'V':
                circuit.V(words[0][1:], node1, node2, int(words[3]) @ u_V)
            elif line[0] == 'I':
                circuit.I(words[0][1:], node1, node2, int(words[3]) @ u_A)
            elif line[0] == 'C':
                circuit.C(words[0][1:], node1, node2, int(words[3]) @ u_F)
            elif line[0] == 'L':
                circuit.L(words[0][1:], node1, node2, int(words[3]) @ u_H)
            else:
                pass
        except(IndexError):
            pass

    print('line 43')
    for resistor in resistors:
        resistor.plus.add_current_probe(circuit)
    print(circuit)

    simulator = circuit.simulator(temperature=25, nominal_temperature=25)
    analysis = simulator.operating_point() # ERROR OCCURING HERE
    print('line 52')
#     if you get errors here make sure to run
#                                         pyspice-post-installation --install-ngspice-dll
#                                         to properly install ngspice
    # print(nodes_set)

    output = ''
    for node in nodes_set:
        if node != 0: # can't index node 0 (ground), and the voltage is always 0 there anyways
            n = node.lower()
            print(n)
            print(analysis.nodes[n])
            output += (str(analysis.nodes[n]) + ' ')

            print(float(analysis.nodes[n]))
            output += (str(float(analysis.nodes[n])) + ' V \n')
        else:
            output += ('n000 ')
            output += '0 V\n'
    output += '\n'
    for node in analysis.branches.values():
        output += str(node) + ' '
        output += str(float(node)) + '\n'
    return output

