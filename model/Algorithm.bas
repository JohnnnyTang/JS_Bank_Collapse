Attribute VB_Name = "Algorithm"
Option Explicit
Option Base 1

Const cintMaxNumberofPoints = 23
Const cintNumberofLayers As Integer = 5
Const cintNumberofSlices As Integer = 15
Const cdblMinFailureWidth As Double = 0.1
Const cdblPi As Double = 3.14159265358979


Sub ComputeLayerSliceArea()
'
' ComputeLayerSliceArea Macro
'
' This macro calculates the geometry of a failure block, the area of layers and slices
' making up a failure block and the confining pressure for each layer.  At the user's
' request, it then prompts for a tension crack depth before converging on the vertical
' slice factor of safety
'
' Original layer macro author: Eddy J. Langendoen (modified by Robert E. Thomas)
'                     USDA-ARS-NSL
'                     PO Box 1157
'                     Oxford, MS 38655
'
' This macro was modified last on 04/01/2003.
'
' Modularization, Minimization routine and slice macro author:
'                       Robert E. Thomas
'                       Civil Engineering,
'                       University of Mississipi,
'                       University, MS 38677
'                   and USDA-ARS-NSL,
'                       P.O. Box 1157,
'                       Oxford, MS 38655
'
' These macros were modified last on 25/02/2008.
'
' The spreadsheets were last modified on 25/02/2008 by RET.
'-----------------Declarations--------------------------------
'
  Dim adblBankGeomX(1 To cintMaxNumberofPoints) As Double
  Dim adblBankGeomZ(1 To cintMaxNumberofPoints) As Double
  Dim adblConfiningAngle(1 To cintNumberofLayers) As Double
  Dim adblConfiningForce(1 To cintNumberofLayers) As Double
  Dim adblCprimeL(1 To cintNumberofSlices) As Double
  Dim adblIntersliceNormalForce(0 To cintNumberofSlices) As Double
  Dim adblIntersliceShearForce(0 To cintNumberofSlices) As Double
  Dim adblNormalForce(1 To cintNumberofSlices) As Double
  Dim adblPoreWaterForce(1 To cintNumberofSlices) As Double
  Dim adblStation(1 To cintNumberofSlices) As Double
  Dim adblTanPhiPrime(1 To cintNumberofSlices) As Double
  Dim adblWeight(1 To cintNumberofSlices) As Double
  Dim adblX(1 To cintMaxNumberofPoints) As Double
  Dim adblZ(1 To cintMaxNumberofPoints) As Double
  Dim blnBankfull As Boolean
  Dim blnDirection As Boolean
  Dim blnFirstSlice As Boolean
  Dim blnTooSteep As Boolean
  Dim dblAngle As Double
  Dim dblArea As Double
  Dim dblBaseElevation As Double
  Dim dblBaseStation As Double
  Dim dblBestBaseElevation As Double
  Dim dblBestFailureAngle As Double
  Dim dblBestFoS As Double
  Dim dblBottomElevation As Double
  Dim dblBottomPressure As Double
  Dim dblBottomStation As Double
  Dim dblConfiningForce As Double
  Dim dblDeltaX As Double
  Dim dblDeltaZ As Double
  Dim dblDistance As Double
  Dim dblElevation1 As Double
  Dim dblElevation2 As Double
  Dim dblElevationBottomLeft As Double
  Dim dblElevationBottomRight As Double
  Dim dblElevationTopLeft As Double
  Dim dblElevationTopRight As Double
  Dim dblFailureAngle As Double
  Dim dblFoS1 As Double
  Dim dblFoS2 As Double
  Dim dblFPIntersectStation As Double
  Dim dblFPIntersectElevation As Double
  Dim dblHLengthFailurePlane As Double
  Dim dblHorizontalComponent As Double
  Dim dblLohnesHandy As Double
  Dim dblMaxTensionCrackDepth As Double
  Dim dblMaxUndercut As Double
  Dim dblPressure As Double
  Dim dblStation1 As Double
  Dim dblStation2 As Double
  Dim dblStationBottomLeft As Double
  Dim dblStationBottomRight As Double
  Dim dblStationTopLeft As Double
  Dim dblStationTopRight As Double
  Dim dblSumDrivingForces As Double
  Dim dblSumResistingForces As Double
  Dim dblTemp As Double
  Dim dblTngAngle As Double
  Dim dblTngFailureAngle As Double
  Dim dblTngFPAngle As Double
  Dim dblToeElevation As Double
  Dim dblToeStation As Double
  Dim dblTopElevation As Double
  Dim dblTopPressure As Double
  Dim dblTopStation As Double
  Dim dblVerticalComponent As Double
  Dim dblWaterBankIntersectStation As Double
  Dim dblWaterElevation As Double
  Dim intFirstLayer As Integer
  Dim intFirstSlice As Integer
  Dim intFirstWetLayer As Integer
  Dim intIteration As Integer
  Dim intLayer As Integer
  Dim intNoSlicesinLayer As Integer
  Dim intNumberofLayers As Integer
  Dim intNumberofSlices As Integer
  Dim intOutputColumn As Integer
  Dim intOutputRow As Integer
  Dim intPoint As Integer
  Dim intResponse As Integer
  Dim intRow As Integer
  Dim intSlice As Integer
  Dim intSubSlice As Integer
  Dim intTension As Integer
  Dim intToePoint As Integer
  Dim intUndercut As Integer
  Dim intUndercutToe As Integer
  Dim intVertex As Integer
  Dim strCantilever As String
  Dim strCell As String
  Dim strErrMsg1 As String
  Dim strErrMsg2 As String
  Dim strErrMsg3 As String
  Dim strErrMsg4 As String
  Dim strErrMsg5 As String
  Dim strErrMsg6 As String
  Dim strInputMsg As String
  Dim strTensionCrack As String
  Dim WAVFile As String
'
'-------------------------------Program--------------------------------
'
' Error messages
'
  strErrMsg1 = "The minimum factor of safety does not occur at the location and angle that you have " _
                 & "specified. Do you want to use the inputted location and angle?"
  strErrMsg2 = "Cannot detect an undercut bank. Please check the geometry and the" _
                 & " failure type."
  strErrMsg3 = "The prescribed failure plane angle (" & Application.WorksheetFunction.Round(Worksheets("Input Geometry").Cells(140, 5) _
                .Value, 1) & " degrees) is too steep for this type of failure. The angle has been" _
                & " automatically reduced to " & Application.WorksheetFunction.Round(44.99 + 0.5 * Application.WorksheetFunction.Min(Range _
                (Worksheets("Calculations").Cells(9, 4), Worksheets("Calculations").Cells(13, 4))), 1) & _
                " degrees."
  strErrMsg4 = "The model has failed to converge. Please try a smaller failure " _
                 & "plane angle or choose to not insert a tension crack."
  strErrMsg5 = "Sorry, but no tension crack has been detected for the entered model parameters."
  strErrMsg6 = "Remember to rerun the Set Bank Geometry Macro on INPUT GEOMETRY if you " _
                 & "make any changes to the values on this sheet."
'
' Input requests
'
  strCantilever = "Your bank is undercut. Do you want to fail your bank by cantilever failure?"
    
  strTensionCrack = "Do you want to insert a tension crack in your bank?"
'---------------------------------------------------------------------------------------------------------
'
' Read inputted bank geometry
'
  Call ReadBankGeometry(adblBankGeomX(), adblBankGeomZ(), intToePoint)
'
' Set the correct output locations depending one whether auto geometry or manual geometry
'
  If Worksheets("Input Geometry").Cells(109, 3).Value = 1 Then
    intOutputColumn = 5
    intOutputRow = 46
  Else
    intOutputColumn = 7
    intOutputRow = 28
  End If
'
' Activate the "Calculations" worksheet
'
  Worksheets("Calculations").Activate
'
' Store the inputted base elevation and failure plane angle
' Set intersect of water surface with bank profile
'
  dblBaseElevation = Worksheets("Input Geometry").Cells(138, 5).Value
  dblFailureAngle = Worksheets("Input Geometry").Cells(140, 5).Value * cdblPi / 180
  dblWaterElevation = Worksheets("Calculations").Cells(63, 2).Value
  dblWaterBankIntersectStation = Worksheets("Calculations").Cells(31, 16).Value
  dblBestFoS = 99999999
'
' Check whether the bank is undercut
'
  Call SetUnderCutIndex(adblBankGeomX(), adblBankGeomZ(), intUndercut, intUndercutToe, _
                            dblMaxUndercut)
'
' Check if the auto shear angle option has been selected
'
  If ((Worksheets("Input Geometry").Cells(intOutputRow, intOutputColumn).Value = "") _
       Or ((intOutputColumn = 5) And (Worksheets("Input Geometry").Cells(44, intOutputColumn).Value = ""))) Then
'
' If the bank is not undercut set the lower limit for the search algorithm equal
' to 2 points from the end (note that in ComputeMinimumFoS, intUndercutToe is incremented by 1, so this means
' it is actually limited to point V)
'
    If dblMaxUndercut = 0 Then intUndercutToe = cintMaxNumberofPoints - 2
'
' Loop over potential failure base locations
'
    intIteration = 1
'
' Evaluate the minimum factor of safety
'
    Call ComputeMinimumFoS(intIteration, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), _
                    dblBaseStation, dblBaseElevation, dblFailureAngle, dblFPIntersectStation, _
                    dblFPIntersectElevation, intUndercutToe, dblWaterElevation, _
                    dblWaterBankIntersectStation, adblConfiningForce(), adblConfiningAngle(), adblWeight(), _
                    dblBestFoS, intOutputRow, intOutputColumn)
'
' Set the shear emergence elevation to nothing for option B
'
'      If (Worksheets("Input Geometry").Cells(109, 3).Value = 2) Then _
'       Worksheets("Input Geometry").Cells(intOutputRow - 2, intOutputColumn).Value = ""
  Else
'
' Compute Factor of Safety for the inputted base elevation and failure plane angle
'
    Worksheets("Input Geometry").Cells(intOutputRow, intOutputColumn).Value = _
                                                    dblFailureAngle * 180 / cdblPi
'
' Calculate intersect of failure surface and bank face
'
    Call SetBankShearIntersectStation(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                                            dblBaseElevation, dblBaseStation, _
                                            intOutputRow, intOutputColumn)
'
' Calculate intersect of failure surface and floodplain
'
    Call SetFloodplainShearIntersect(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                                        dblBaseStation, dblBaseElevation, dblFailureAngle, _
                                        dblFPIntersectStation, dblFPIntersectElevation)
'
' Determine how many layers span the failure block
'
    intNumberofLayers = NumberOfLayersInBank(dblBaseElevation)
'
' Compute confining force and angle.
'
    Call SetWaterForce(intIteration, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), _
                            dblBaseStation, dblBaseElevation, dblWaterElevation, _
                            dblWaterBankIntersectStation, adblConfiningForce(), adblConfiningAngle())
'
' Calculate areas of the layers
'
    Call SetLayerWeight(intIteration, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), _
                            dblBaseStation, dblBaseElevation, dblFPIntersectStation, _
                            dblFPIntersectElevation, adblWeight())
  End If
'
' Check whether the user wants to insert a tension crack or not
' And dblMaxUndercut = 0
  intTension = MsgBox(strTensionCrack, vbYesNo, "Tension Crack?")
  If intTension = 6 Then
'--------------------Vertical Slice Factor of Safety Calculations----------------------
'
' Check that the failure plane angle is not too steep
'
' EL: 3/22/2013 made a minor change here to only use the layers comprising the failure block
'
' Determine how many layers span the failure block
'
    intNumberofLayers = NumberOfLayersInBank(dblBaseElevation)
    If Worksheets("Input Geometry").Cells(140, 5).Value > 45 + Application.WorksheetFunction. _
        Min(Range(Worksheets("Calculations").Cells(9, 4), Worksheets("Calculations").Cells(9 + intNumberofLayers - 1, 4))) Then
      intResponse = MsgBox(strErrMsg3, vbInformation, "Caution!")
      
' Output the corrected failure plane angle to the suitable cell (depending on whether auto geometry
' or manual geometry
      If Worksheets("Input Geometry").Cells(109, 3).Value = 1 Then
        Worksheets("Input Geometry").Cells(intOutputRow, intOutputColumn).Value = 44.99 + 0.5 * Application.WorksheetFunction. _
              Min(Range(Worksheets("Calculations").Cells(9, 4), Worksheets("Calculations").Cells(9 + intNumberofLayers - 1, 4)))
      Else
        Worksheets("Input Geometry").Cells(intOutputRow, intOutputColumn).Value = 44.99 + 0.5 * Application.WorksheetFunction. _
              Min(Range(Worksheets("Calculations").Cells(9, 4), Worksheets("Calculations").Cells(9 + intNumberofLayers - 1, 4)))
      End If
'
' Set up the initial bank geometry
'
      dblFailureAngle = Worksheets("Input Geometry").Cells(140, 5).Value * cdblPi / 180
      Call SetBankShearIntersectStation(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                                          dblBaseElevation, dblBaseStation, intOutputRow, intOutputColumn)
      Call SetFloodplainShearIntersect(intIteration, adblBankGeomX(), adblBankGeomZ(), dblBaseStation, _
                              dblBaseElevation, dblFailureAngle, dblFPIntersectStation, dblFPIntersectElevation)
'
' Recompute confining force and angle.
'
      Call SetWaterForce(intIteration, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), _
                            dblBaseStation, dblBaseElevation, dblWaterElevation, _
                            dblWaterBankIntersectStation, adblConfiningForce(), adblConfiningAngle())
'
' Recalculate areas of the layers
'
      Call SetLayerWeight(intIteration, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), _
                            dblBaseStation, dblBaseElevation, dblFPIntersectStation, _
                            dblFPIntersectElevation, adblWeight())
    End If
'
' Activate the "VertSliceCalcs" worksheet
'
    Worksheets("VertSliceCalcs").Activate
'
' Delete area values for every slice
'
    Range(Worksheets("VertSliceCalcs").Cells(4, 4), Worksheets("VertSliceCalcs").Cells(18, 9)).ClearContents
'
' Set intersects of slices with bank profile and failure plane
'
' Determine how many slices span the failure block
'
    intNumberofSlices = intNumberofLayers * (cintNumberofSlices / cintNumberofLayers)
'
' Initialise dblTopStation to be the failure plane base
'
    dblTopStation = dblBaseStation
    dblTopElevation = dblBaseElevation
    dblBottomElevation = dblTopElevation
    Worksheets("VertSliceCalcs").Cells(intNumberofSlices + 32, 16).Value = dblTopStation
    Worksheets("VertSliceCalcs").Cells(intNumberofSlices + 5, 17).Value = dblTopElevation
    Worksheets("VertSliceCalcs").Cells(intNumberofSlices + 32, 17).Value = dblBottomElevation
'
' Loop over the slices
'
    For intSlice = intNumberofSlices - 1 To 1 Step -1
'
' Determine the station of the slice
'
      intSubSlice = 1 + intSlice Mod (cintNumberofSlices / cintNumberofLayers)
      intLayer = (intSlice + 2) / (cintNumberofSlices / cintNumberofLayers)
      dblTopStation = dblTopStation - _
                   (dblTopStation - Worksheets("Calculations").Cells(21 + intLayer, 16).Value) / intSubSlice
      If (dblMaxUndercut > 0) Then
        If dblTopStation > adblBankGeomX(intUndercutToe) Then _
                                                            dblTopStation = adblBankGeomX(intUndercutToe)
      End If
'
' Determine the intersect of the slice and the failure plane
'
      dblBottomElevation = Worksheets("Calculations").Cells(21 + intLayer, 17).Value - _
                            (Worksheets("Calculations").Cells(21 + intLayer, 17).Value - _
                            Worksheets("VertSliceCalcs").Cells(intSlice + 33, 17).Value) * _
                            (dblTopStation - Worksheets("Calculations").Cells(21 + intLayer, 16).Value) / _
                            (Worksheets("VertSliceCalcs").Cells(intSlice + 33, 16).Value - _
                            Worksheets("Calculations").Cells(21 + intLayer, 16).Value)
'
' Determine the intersect of the slice and the bank
' Go to row with top of the bank and search for points in bank profile
' surrounding the slice station
'
      intPoint = 0
      Do While (cintMaxNumberofPoints > intPoint + 1)
        intPoint = intPoint + 1
        dblStation1 = adblBankGeomX(intPoint)
        dblStation2 = adblBankGeomX(intPoint + 1)
        If dblStation2 > dblTopStation Then Exit Do
      Loop
      dblElevation1 = adblBankGeomZ(intPoint)
      dblElevation2 = adblBankGeomZ(intPoint + 1)
'
' Calculate elevation of intersection point and write it to the active cell
'
      dblTopElevation = dblElevation2 - (dblElevation2 - dblElevation1) * (dblTopStation - dblStation2) _
                                            / (dblStation1 - dblStation2)
      Worksheets("VertSliceCalcs").Cells(intSlice + 32, 16).Value = dblTopStation
      Worksheets("VertSliceCalcs").Cells(intSlice + 5, 17).Value = dblTopElevation
      Worksheets("VertSliceCalcs").Cells(intSlice + 32, 17).Value = dblBottomElevation
    Next intSlice
'
' Set positions of slices not in the failure block to nothing
'
    For intSlice = intNumberofSlices + 1 To cintNumberofSlices
      Worksheets("VertSliceCalcs").Cells(intSlice + 5, 17).Value = ""
      Worksheets("VertSliceCalcs").Cells(intSlice + 32, 16).Value = 0
      Worksheets("VertSliceCalcs").Cells(intSlice + 32, 17).Value = -99999
    Next intSlice
'
' Calculate volumes of the slices
'
    For intSlice = 1 To intNumberofSlices
'
' Determine how many layers potentially span the failure block
'
      intNumberofLayers = (intSlice + 1) / (cintNumberofSlices / cintNumberofLayers)
'
' Find the uppermost layer within the slice
'
      intFirstLayer = intNumberofLayers
      Do While ((intFirstLayer > 1) And (Application.WorksheetFunction.Max(Worksheets("VertSliceCalcs").Cells(intSlice + 4, 17).Value, _
                                            Worksheets("VertSliceCalcs").Cells(intSlice + 5, 17).Value) > _
                                            Worksheets("Calculations").Cells(4 + intFirstLayer, 17).Value))
        intFirstLayer = intFirstLayer - 1
      Loop
'
' Determine where our target slice is in the layer
'
      intSubSlice = intSlice - (intNumberofLayers - 1) * (cintNumberofSlices / cintNumberofLayers)
'
' Loop over layers to determine weight of each soil element in a slice
'
      For intLayer = intNumberofLayers To intFirstLayer Step -1
' Initialization
        intVertex = 0
'
' Set bottom vertices of soil element
'
        If (intLayer = intNumberofLayers And intSubSlice = 1) Then
' Bottom, valley-side soil element, one vertex: intersect of failure surface
' and stream side of soil element
          adblX(intVertex + 1) = Worksheets("VertSliceCalcs").Cells(32 + intSlice, 16).Value
          adblZ(intVertex + 1) = Worksheets("VertSliceCalcs").Cells(32 + intSlice, 17).Value
          intVertex = intVertex + 1  'increment vertex
        ElseIf (intLayer = intNumberofLayers) Then
' Bottom, most stream-side soil elements, two vertices: intersects of failure
' surface and slice sides
          adblX(intVertex + 1) = Worksheets("VertSliceCalcs").Cells(32 + intSlice, 16).Value
          adblZ(intVertex + 1) = Worksheets("VertSliceCalcs").Cells(32 + intSlice, 17).Value
          adblX(intVertex + 2) = Worksheets("VertSliceCalcs").Cells(31 + intSlice, 16).Value
          adblZ(intVertex + 2) = Worksheets("VertSliceCalcs").Cells(31 + intSlice, 17).Value
          intVertex = intVertex + 2  'increment vertex
        Else
' Two vertices: stream- and valley-side top vertices of soil element below
          adblX(intVertex + 1) = dblStationTopRight
          adblZ(intVertex + 1) = dblElevationTopRight
          adblX(intVertex + 2) = dblStationTopLeft
          adblZ(intVertex + 2) = dblElevationTopLeft
          intVertex = intVertex + 2  'increment vertex
        End If
'
' Set top valley-side vertex of soil element
'
        If (intLayer = intNumberofLayers And intSubSlice = 1) Then
' Bottom, valley-side soil element: intersect of failure surface and valley
' side of soil element
          dblStationTopLeft = Worksheets("VertSliceCalcs").Cells(31 + intSlice, 16).Value
          dblElevationTopLeft = Worksheets("VertSliceCalcs").Cells(31 + intSlice, 17).Value
        ElseIf (intLayer = intFirstLayer) Then
' Top soil element: intersect of bank profile and valley side of soil element
          dblStationTopLeft = Worksheets("VertSliceCalcs").Cells(4 + intSlice, 16).Value
          dblElevationTopLeft = Worksheets("VertSliceCalcs").Cells(4 + intSlice, 17).Value
        Else
' Intersect of valley side of soil element and top of soil layer
          dblStationTopLeft = Worksheets("VertSliceCalcs").Cells(4 + intSlice, 16).Value
          dblElevationTopLeft = Worksheets("Calculations").Cells(4 + intLayer, 17).Value
        End If
        adblX(intVertex + 1) = dblStationTopLeft
        adblZ(intVertex + 1) = dblElevationTopLeft
        intVertex = intVertex + 1  'increment vertex
'
' Set top stream-side vertex of soil element.
'
        If intSlice = intNumberofSlices Then
          dblStationTopRight = Worksheets("Calculations").Cells(4 + intLayer, 16).Value
        Else
          dblStationTopRight = Application.WorksheetFunction.Min(Worksheets("VertSliceCalcs").Cells(5 + intSlice, 16).Value, _
                                                                Worksheets("Calculations").Cells(4 + intLayer, 16).Value)
        End If
        If (intLayer = intFirstLayer) Then
' Top soil element: intersect of floodplain and stream side of soil element
          If (intSlice = cintNumberofSlices) Then
            dblElevationTopRight = Worksheets("Calculations").Cells(5, 17).Value
          Else
            dblElevationTopRight = Application.WorksheetFunction.Max(Worksheets("VertSliceCalcs").Cells(5 + intSlice, 17).Value, _
                                                            Worksheets("Calculations").Cells(4 + intLayer, 17).Value)
          End If
        Else
' Intersect of stream side of soil element and top of soil layer
          dblElevationTopRight = Worksheets("Calculations").Cells(4 + intLayer, 17).Value
        End If
'
' Check that there is a top stream side intersect for the slice and add it to the polygon
'
        If (Worksheets("Calculations").Cells(4 + intLayer, 16).Value > _
                                Worksheets("VertSliceCalcs").Cells(4 + intSlice, 16).Value) Then
          adblX(intVertex + 1) = dblStationTopRight
          adblZ(intVertex + 1) = dblElevationTopRight
          intVertex = intVertex + 1  'increment vertex
        End If
'
' Add bank nodes to polygon until a node's elevation equals or drops below the
' elevation of the intersect of bank profile with the bottom of soil slice.
'
        For intPoint = 1 To cintMaxNumberofPoints
          If ((intSlice = intNumberofSlices) Or (adblX(1) > adblBankGeomX(intPoint))) And _
                  (dblElevationTopRight > adblBankGeomZ(intPoint) And _
                  adblBankGeomZ(intPoint) > adblZ(1)) Then
            adblX(intVertex + 1) = adblBankGeomX(intPoint)
            adblZ(intVertex + 1) = adblBankGeomZ(intPoint)
            intVertex = intVertex + 1   'increment vertex
          End If
        Next intPoint
'
' If the slice intersects the bank face, add the right edge of the slice to the polygon
'
        If (Worksheets("VertSliceCalcs").Cells(5 + intSlice, 16).Value > _
              Worksheets("Calculations").Cells(4 + intLayer, 16).Value And _
              Worksheets("VertSliceCalcs").Cells(5 + intSlice, 17).Value > adblZ(1)) Then
          adblX(intVertex + 1) = Worksheets("VertSliceCalcs").Cells(5 + intSlice, 16).Value
          adblZ(intVertex + 1) = Worksheets("VertSliceCalcs").Cells(5 + intSlice, 17).Value
          intVertex = intVertex + 1   'increment vertex
        End If
'
' Compute volume of slice and write to spreadsheet
'
        dblArea = PolygonArea(adblX, adblZ, intVertex)
        Worksheets("VertSliceCalcs").Cells(3 + intSlice, 3 + intLayer).Value = dblArea
      Next intLayer
    Next intSlice
'
' Calculate volume of water in each slice
'
    intSlice = 1
    dblTopElevation = Application.WorksheetFunction.Round(Worksheets("VertSliceCalcs").Cells(5 + intSlice, 17).Value, 6)
    Do While (dblTopElevation > dblWaterElevation)
      dblTopElevation = Application.WorksheetFunction.Round(Worksheets("VertSliceCalcs").Cells(5 + intSlice, 17).Value, 6)
      intSlice = intSlice + 1
      If (cintNumberofSlices = intSlice) Then
        dblTopElevation = Application.WorksheetFunction.Round(Worksheets("VertSliceCalcs").Cells(5, 17).Value, 6)
        Exit Do
      End If
    Loop
'
' Recalculate Bank Intersect Station if bankfull
' Water surface elevation above the top of the bank
    If blnBankfull Then dblWaterBankIntersectStation = Worksheets("Calculations").Cells(16, 16).Value
'
' Initialize two vertices
'
    dblStationBottomRight = Worksheets("VertSliceCalcs").Cells(4 + intSlice, 16).Value
    dblElevationBottomRight = Worksheets("VertSliceCalcs").Cells(4 + intSlice, 17).Value
    dblStationTopRight = Worksheets("VertSliceCalcs").Cells(4 + intSlice, 16).Value
    dblElevationTopRight = dblWaterElevation
'
' Loop over the slices
'
    blnFirstSlice = False
    For intSlice = 1 To intNumberofSlices
      dblTopElevation = Application.WorksheetFunction.Round(Worksheets("VertSliceCalcs").Cells(5 + intSlice, 17).Value, 6)
      If (dblWaterElevation >= dblTopElevation) Then
        If Not blnFirstSlice Then
          intFirstSlice = intSlice
          blnFirstSlice = True
        End If
'
' Top valley-side intersect of the slice and slip surface is the bottom valley-
' side intersect of the slice above
'
        dblStationTopLeft = dblStationTopRight
        dblElevationTopLeft = dblElevationTopRight
'
' Assemble polygon vertices of the volume of water in the slice
'
        intVertex = 0
        If (intSlice = intFirstSlice And Not blnBankfull) Then
' One vertex only: intersect of water surface and bank face
          adblX(intVertex + 1) = dblWaterBankIntersectStation
          adblZ(intVertex + 1) = dblWaterElevation
          intVertex = intVertex + 1   'increment vertex
        Else
' Two vertices valley side, top then bottom:
          adblX(intVertex + 1) = dblStationBottomRight
          adblZ(intVertex + 1) = dblElevationBottomRight
          adblX(intVertex + 2) = dblStationTopLeft
          adblZ(intVertex + 2) = dblWaterElevation
          intVertex = intVertex + 2   'increment vertex
        End If
'
' Top stream-side vertex
'
        If intSlice = intNumberofSlices Then
          dblStationTopRight = Application.WorksheetFunction.Max(Worksheets("VertSliceCalcs").Cells(5 + intSlice, 16).Value, _
                                                                    dblWaterBankIntersectStation)
        Else
          dblStationTopRight = Worksheets("VertSliceCalcs").Cells(5 + intSlice, 16).Value
        End If
        dblElevationTopRight = dblWaterElevation
        adblX(intVertex + 1) = dblStationTopRight
        adblZ(intVertex + 1) = dblElevationTopRight
        intVertex = intVertex + 1   'increment vertex
'
' Bottom stream-side vertex
'
        dblStationBottomRight = dblStationTopRight
        dblElevationBottomRight = Worksheets("VertSliceCalcs").Cells(5 + intSlice, 17).Value
        adblX(intVertex + 1) = dblStationBottomRight
        adblZ(intVertex + 1) = dblElevationBottomRight
        intVertex = intVertex + 1   'increment vertex
'
' Find first node on the bank face that may possibly be added to the polygon
'
        For intPoint = cintMaxNumberofPoints To 1 Step -1
          If (adblBankGeomZ(intPoint) > Worksheets("VertSliceCalcs").Cells(5 + intSlice, 17).Value) Then Exit For
        Next intPoint
'
' Add bank nodes to polygon until a node's elevation equals or drops below the
' elevation of the intersect of bank profile with the bottom of soil slice.
'
        Do While (adblZ(2) > adblBankGeomZ(intPoint) And _
                    adblBankGeomX(intPoint) > Worksheets("VertSliceCalcs").Cells(4 + intSlice, 16).Value)
          adblX(intVertex + 1) = adblBankGeomX(intPoint)
          adblZ(intVertex + 1) = adblBankGeomZ(intPoint)
          intVertex = intVertex + 1   'increment vertex
          intPoint = intPoint - 1
        Loop
'
' Compute volume and write to spreadsheet
'
        dblArea = PolygonArea(adblX, adblZ, intVertex)
        Worksheets("VertSliceCalcs").Cells(3 + intSlice, 9).Value = dblArea
'
' Set volumes for slices not affected by the water surface to nothing
'
      Else
        Worksheets("VertSliceCalcs").Cells(3 + intSlice, 9).Value = ""
      End If
    Next intSlice
    For intSlice = intNumberofSlices + 1 To cintNumberofSlices
      Worksheets("VertSliceCalcs").Cells(3 + intSlice, 9).Value = ""
    Next intSlice
'
' Compute confining force
'
' Check if water surface elevation is below the base of the failure surface
'
    If (dblWaterElevation <= dblBaseElevation) Then
'
' Water surface elevation is below base of slip surface.  Set confining force
' to zero
'
      For intSlice = 1 To cintNumberofSlices
        Worksheets("VertSliceCalcs").Cells(61, 1 + intSlice).Value = 0
      Next intSlice
    Else
'
' Compute confining force and write to spreadsheet
'
      Worksheets("VertSliceCalcs").Cells(61, 1 + intNumberofSlices).Value = 0.5 * 9.807 _
                                                                    * ((dblWaterElevation - dblBaseElevation) ^ 2)
'
' Set forces to zero for slices above the water surface or below the base of the slip
' surface.
'
      For intSlice = 1 To intNumberofSlices - 1
        Worksheets("VertSliceCalcs").Cells(61, 1 + intSlice).Value = 0
      Next intSlice
      For intSlice = intNumberofSlices + 1 To cintNumberofSlices
        Worksheets("VertSliceCalcs").Cells(61, 1 + intSlice).Value = 0
      Next intSlice
    End If
'
' Determine the horizontal length of the failure plane
'
    dblHLengthFailurePlane = Worksheets("Calculations").Cells(15, 16).Value - _
                                dblFPIntersectStation
'
' Activate the "VertSliceCalcs" worksheet
'
    Worksheets("VertSliceCalcs").Activate
    adblConfiningForce(1) = Worksheets("VertSliceCalcs").Cells(61, 17).Value
'
' Determine how many slices span the failure block
'
    intNumberofSlices = 0
    For intSlice = 1 To cintNumberofSlices
      dblTopElevation = Worksheets("VertSliceCalcs").Cells(31 + intSlice, 17).Value
      If (dblTopElevation <= dblBaseElevation) Then
        Exit For
      Else
        intNumberofSlices = intNumberofSlices + 1
      End If
    Next intSlice
'
' Calculate Ordinary Force Factor of Safety
'
    dblFoS2 = Cos(dblFailureAngle) * (Worksheets("VertSliceCalcs").Cells(55, 4).Value _
                + Worksheets("VertSliceCalcs").Cells(62, 17).Value - Worksheets("VertSliceCalcs"). _
                Cells(60, 17).Value) / (Worksheets("VertSliceCalcs").Cells(64, 17).Value - adblConfiningForce(1))
    intFirstSlice = 1
'
' Loop until FoS converges
'
    intIteration = 0 ' EL: The below loop should be ran at least twice (03/22/2013)
    Do While (Application.WorksheetFunction.Round(dblFoS1, 2) <> Application.WorksheetFunction.Round(dblFoS2, 2)) Or _
                    (intIteration < 2)
      dblFoS1 = dblFoS2
      intIteration = intIteration + 1
'
' On second iteration, check interslice shear forces and insert a tension crack
'
      If intIteration = 2 Then
        dblTemp = 99999999
        For intLayer = 1 To intNumberofLayers
          If dblTemp > Worksheets("Calculations").Cells(23 + intLayer, 4).Value Then _
            dblTemp = Worksheets("Calculations").Cells(23 + intLayer, 4).Value
        Next intLayer
        dblLohnesHandy = Application.WorksheetFunction.Round((2 * Application.WorksheetFunction.Max(Worksheets("Bank Model Output") _
                        .Cells(84, 8).Value, Worksheets("Bank Model Output").Cells(85, 8).Value, Worksheets _
                        ("Bank Model Output").Cells(86, 8).Value, Worksheets("Bank Model Output").Cells(87, 8).Value, _
                        Worksheets("Bank Model Output").Cells(88, 8).Value) / dblTemp) * Tan(cdblPi / 4 + _
                        (Application.WorksheetFunction.Max(Worksheets("Calculations").Cells(9, 4).Value, _
                        Worksheets("Calculations").Cells(10, 4).Value, Worksheets("Calculations").Cells(11, 4).Value, _
                        Worksheets("Calculations").Cells(12, 4).Value, Worksheets("Calculations").Cells(13, 4).Value)) * _
                        cdblPi / 360), 2)
'
' Input Box to request maximum tension crack depth
'
        strInputMsg = "Enter the Tension Crack Depth. For these soils, the maximum tension crack depth according to" _
                    & " Lohnes and Handy (1968) is " & dblLohnesHandy & " m. " _
                    & " A better estimate can often be obtained from the heights of vertical" _
                    & " faces observed in the field."
        dblMaxTensionCrackDepth = Application.InputBox(strInputMsg, "Tension crack depth", dblLohnesHandy / 2, Type:=3)
'
' Determine the location of the tension crack
'
        For intSlice = intNumberofSlices To 1 Step -1
          If (0 > adblIntersliceNormalForce(intSlice)) And (dblMaxTensionCrackDepth >= (Worksheets( _
                    "VertSliceCalcs").Cells(5, 17).Value - Worksheets("VertSliceCalcs") _
                    .Cells(32 + intSlice, 17).Value)) Then
            dblFPIntersectStation = adblStation(intSlice)
            dblHLengthFailurePlane = Worksheets("Calculations").Cells(15, 16).Value - _
                                     dblFPIntersectStation
            Worksheets("VertSliceCalcs").Cells(26, 16).Value = dblFPIntersectStation
            Worksheets("VertSliceCalcs").Cells(26, 17).Value = Worksheets("VertSliceCalcs") _
                                                                .Cells(32 + intSlice, 17).Value
            Worksheets("VertSliceCalcs").Cells(27, 16).Value = dblFPIntersectStation
            Worksheets("VertSliceCalcs").Cells(27, 17).Value = Worksheets("VertSliceCalcs") _
                                                                .Cells(5 + intSlice, 17).Value
            intFirstSlice = intSlice + 1
            intRow = 3 + (intFirstSlice - 1)
            Do While intRow > 3
              Worksheets("VertSliceCalcs").Cells(intRow, 4).Value = ""
              Worksheets("VertSliceCalcs").Cells(intRow, 5).Value = ""
              Worksheets("VertSliceCalcs").Cells(intRow, 6).Value = ""
              Worksheets("VertSliceCalcs").Cells(intRow, 7).Value = ""
              Worksheets("VertSliceCalcs").Cells(intRow, 8).Value = ""
              Worksheets("VertSliceCalcs").Cells(intRow, 9).Value = ""
              intRow = intRow - 1
            Loop
            Exit For
          End If
        Next intSlice
      Else
        intSlice = intFirstSlice
      End If
'
' Initialise resisting and driving forces to 0
'
      dblSumResistingForces = 0
      dblSumDrivingForces = 0
'
' Loop over the active slices
'
' Initialise the Interslice Normal and Shear Forces
'
      adblIntersliceNormalForce(intFirstSlice - 1) = 0
      adblIntersliceShearForce(intFirstSlice - 1) = 0
'
      For intSlice = intFirstSlice To intNumberofSlices
'
' Get the station, weight, c'L, U and Tan Phi' of the slice
'
        If intIteration = 1 Then
          adblStation(intSlice) = Worksheets("VertSliceCalcs").Cells(5 + intSlice, 16).Value
          adblWeight(intSlice) = Worksheets("VertSliceCalcs").Cells(3 + intSlice, 10).Value
          adblCprimeL(intSlice) = Worksheets("VertSliceCalcs").Cells(39 + intSlice, 4).Value
          adblPoreWaterForce(intSlice) = Worksheets("VertSliceCalcs").Cells(60, 1 + intSlice).Value
          adblNormalForce(intSlice) = adblWeight(intSlice) * Cos(dblFailureAngle)
          adblTanPhiPrime(intSlice) = Tan(Worksheets("Calculations").Cells(8 + Application. _
                                        WorksheetFunction.RoundUp(intSlice / 3, 0), 4).Value * cdblPi / 180)
' Set the interslice shear force equal to zero
          adblIntersliceShearForce(intSlice) = 0
        End If
'
' Calculate the Interslice Normal Force and the Interslice Shear Force
'
        If intSlice = intNumberofSlices Then
          adblIntersliceNormalForce(intSlice) = 0
        Else
          adblIntersliceNormalForce(intSlice) = adblIntersliceNormalForce(intSlice - 1) - _
                        ((adblCprimeL(intSlice) - adblPoreWaterForce(intSlice)) * Cos(dblFailureAngle) / dblFoS1) _
                        + adblNormalForce(intSlice) * (Sin(dblFailureAngle) - ((Cos(dblFailureAngle) * _
                        adblTanPhiPrime(intSlice)) / dblFoS1))
        End If
'
' Calculate the Interslice Shear Force
'
        If intIteration <> 1 Then adblIntersliceShearForce(intSlice) = _
                            0.4 * adblIntersliceNormalForce(intSlice) * Sin(cdblPi * (adblStation(intSlice) - _
                                                        dblFPIntersectStation) / dblHLengthFailurePlane)
'
' Recalculate the Normal Force
'
        adblNormalForce(intSlice) = (adblWeight(intSlice) + (adblIntersliceShearForce(intSlice - 1) - _
                    adblIntersliceShearForce(intSlice)) - ((adblCprimeL(intSlice) - adblPoreWaterForce(intSlice)) * _
                    Sin(dblFailureAngle) / dblFoS1)) / (Cos(dblFailureAngle) + (adblTanPhiPrime(intSlice) * _
                    Sin(dblFailureAngle) / dblFoS1))
        If (0 > adblNormalForce(intSlice)) Then adblNormalForce(intSlice) = 0
'
' Sum the driving and resisting forces over the slice
'
        dblSumResistingForces = dblSumResistingForces + ((adblNormalForce(intSlice) * adblTanPhiPrime(intSlice)) _
                                + adblCprimeL(intSlice) - adblPoreWaterForce(intSlice))
        dblSumDrivingForces = dblSumDrivingForces + adblNormalForce(intSlice)
      Next intSlice
'
' If Denominator of Factor of Safety equation = 0 Then set it to the Failure Angle
'
      If dblSumDrivingForces = 0 Then dblSumDrivingForces = 1
'
' Calculate the Factor of Safety (1st iteration = Janbu's Simplified)
'
      dblFoS2 = ((Cos(dblFailureAngle) * dblSumResistingForces) + (dblFoS1 * adblConfiningForce(1))) _
                    / (Sin(dblFailureAngle) * dblSumDrivingForces)
'
' If the model does not converge, try again
'
      If intIteration = 32767 Then
'
' Check that the failure plane angle is not too steep
'
        MsgBox strErrMsg4, vbInformation, "Error!"
        Exit Sub
      End If
    Loop
'
' After Convergence, check the number of iterations, give a message if necessary and then
' write the factor of safety to the active cell
'
    If (intIteration = 1) Then MsgBox strErrMsg5, vbInformation, "No Tension Crack!"
    Worksheets("VertSliceCalcs").Cells(67, 17).Value = (dblFoS1 + dblFoS2) / 2
  End If

' --------------------End of Vertical Slice Factor of Safety Calculations--------------------
'
'    If (Worksheets("Calculations").Cells(22, 16).Value > _
'       Worksheets("Calculations").Cells(5, 16).Value) Then
'      If Not blnTooSteep Then
'        intResponse = MsgBox(strErrMsg5, vbInformation, "Incorrect failure plane")
'        Worksheets("Input Geometry").Activate
'        Exit Sub
'      End If
'    End If
'
' Activate the desired worksheet
'
  Worksheets("Bank Model Output").Activate
  If (dblFoS1 <> 0) Then
    intResponse = MsgBox("The Fs with no tension crack is " & Application.WorksheetFunction.Round(Worksheets("Calculations") _
                .Cells(77, 12).Value, 2) & ".", vbInformation, "Horizontal Layer Factor of Safety")
    intResponse = MsgBox(strErrMsg6, vbInformation, "Reminder.")
  End If
'
End Sub

Sub ComputeMinimumFoS(intIteration As Integer, intNumberofLayers As Integer, adblBankGeomX() As Double, _
                    adblBankGeomZ() As Double, dblBaseStation As Double, dblBestBaseElevation As Double, _
                    dblBestFailureAngle As Double, dblFPIntersectStation As Double, _
                    dblFPIntersectElevation As Double, intUndercutToe As Integer, dblWaterElevation As Double, _
                    dblWaterBankIntersectStation As Double, adblConfiningForce() As Double, _
                    adblConfiningAngle() As Double, adblWeight() As Double, dblBestFoS As Double, _
                    intOutputRow As Integer, intOutputColumn As Integer)
'
' Local Declarations
'
  Dim adblCPrime(1 To cintNumberofLayers) As Double
  Dim adblFriction(1 To cintNumberofLayers) As Double
  Dim adblPhib(1 To cintNumberofLayers) As Double

  Dim blnBetter As Boolean
  Dim blnGroundWaterRun As Boolean
  Dim dblAngle As Double
  Dim dblAngleRangeStored As Double
  Dim dblBaseElevation As Double
  Dim dblBestFoSStored As Double
  Dim dblLength As Double
  Dim dblMaxAngle As Double
  Dim dblMinAngle As Double
  Dim dblNewAngleRange As Double
  Dim dblNewFailureAngle As Double
  Dim dblNewFoS As Double
  Dim dblOldAngleRange As Double
  Dim dblRandAngle As Double
  Dim dblReducedAngle As Double
  Dim dblSumLength As Double
  Dim intBasePoint As Integer
  Dim intLayer As Integer
  Dim intPoint As Integer
  Dim intSearch As Integer
  Dim strErrMsg As String
'
' Error messages
'
  strErrMsg = "The bank angle is less than the friction angle! The bank should not fail in this situation"
'
' Provide the user with some output
'
  Application.StatusBar = "Finding the minimum Factor of Safety..."
'
' Initialize blnGroundWaterRun
'
  blnGroundWaterRun = False
'
' Get the cohesion, friction angle and phi b values
'
  For intLayer = 1 To cintNumberofLayers
    adblCPrime(intLayer) = Worksheets("Calculations").Cells(13 + intLayer, 4).Value
    adblFriction(intLayer) = Worksheets("Calculations").Cells(8 + intLayer, 4).Value
    adblPhib(intLayer) = Worksheets("Calculations").Cells(18 + intLayer, 4).Value
  Next intLayer
'
' Set the initial location of the base of the failure plane
'
  If Worksheets("Input Geometry").Cells(109, 3).Value = 1 Then
    intBasePoint = cintMaxNumberofPoints - 1
  Else
    intBasePoint = cintMaxNumberofPoints - 3
  End If
'
' March up the bank
'
  For intSearch = intBasePoint To 3 Step -1
    dblBaseElevation = adblBankGeomZ(intSearch)
'
' Calculate intersect of failure surface and bank face
'
    Call SetBankShearIntersectStation(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                            dblBaseElevation, dblBaseStation, intOutputRow, intOutputColumn)
'
' Determine how many layers span the failure block
'
    intNumberofLayers = NumberOfLayersInBank(dblBaseElevation)
'
' Set the minimum angle
'
    dblMinAngle = ComputeMinAngle(intNumberofLayers, dblBaseElevation, adblFriction())
'
' Find the valleyward bank angle. This is the maximum failure plane angle
    dblMaxAngle = ComputeMaxAngle(intIteration, intNumberofLayers, dblBaseElevation, _
                        dblBaseStation, dblFPIntersectStation, dblFPIntersectElevation, _
                        adblBankGeomX(), adblBankGeomZ())
'
' Set the initial failure angle equal to the mean of the weighted mean phi prime and bank angle values
' and set the initial angle range
'
    If (dblMaxAngle > dblMinAngle) Then
      dblNewFailureAngle = 0.5 * (dblMaxAngle + dblMinAngle)
'
' Compute Fs
      dblNewFoS = ComputeFoS(intIteration, 1, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), adblCPrime(), _
                    adblFriction(), adblPhib(), dblBaseStation, dblBaseElevation, dblNewFailureAngle, _
                    dblFPIntersectStation, dblFPIntersectElevation, dblWaterElevation, _
                    dblWaterBankIntersectStation, adblConfiningForce(), adblConfiningAngle(), adblWeight(), _
                    intOutputRow, intOutputColumn)
'
' Compare with stored value and store optimal values
      If (dblNewFoS < dblBestFoS) Then
        dblBestFoS = dblNewFoS
        dblBestFailureAngle = dblNewFailureAngle
        dblBestBaseElevation = dblBaseElevation
      End If
    End If
  Next intSearch
'
' Catch the situation where the bank angle is too low for failure to occur
'
  If (dblBestFailureAngle = 0) Then
    MsgBox strErrMsg, vbInformation, "Error!"
'
' Set the coordinates of the shear plane to be the bank-most node
    With Worksheets("Calculations")
      .Cells(15, 16).Value = .Cells(27, 6).Value
      .Cells(16, 16).Value = .Cells(27, 6).Value
      Worksheets("VertSliceCalcs").Cells(25, 16).Value = .Cells(27, 6).Value
      Worksheets("VertSliceCalcs").Cells(26, 16).Value = .Cells(27, 6).Value
      .Cells(15, 17).Value = .Cells(27, 7).Value
      .Cells(16, 17).Value = .Cells(27, 7).Value
      Worksheets("VertSliceCalcs").Cells(25, 17).Value = .Cells(27, 7).Value
      Worksheets("VertSliceCalcs").Cells(26, 17).Value = .Cells(27, 7).Value
      Worksheets("VertSliceCalcs").Cells(27, 16).Value = ""
      Worksheets("VertSliceCalcs").Cells(27, 17).Value = ""
    End With
    End
  End If
'-------------------------------------- END INITIALIZATION --------------------------------------
' Enter the minimization loop
  Do
' Initialize with the best base elevation from the previous loop
'
    dblBaseElevation = dblBestBaseElevation
'
' Calculate intersect of failure surface and bank face
'
    Call SetBankShearIntersectStation(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                            dblBaseElevation, dblBaseStation, intOutputRow, intOutputColumn)
'
' Determine how many layers span the failure block
    intNumberofLayers = NumberOfLayersInBank(dblBaseElevation)
'
' Compute confining force and angle. This only needs to be done once for each failure base position
''
'    Call SetWaterForce(intIteration, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), _
'                        dblBaseStation, dblBaseElevation, dblWaterElevation, dblWaterBankIntersectStation, _
'                        adblConfiningForce(), adblConfiningAngle())
'
' Set the minimum angle
'
    dblMinAngle = ComputeMinAngle(intNumberofLayers, dblBaseElevation, adblFriction())
'
' Find the valleyward bank angle. This is the maximum failure plane angle
    dblMaxAngle = ComputeMaxAngle(intIteration, intNumberofLayers, dblBaseElevation, _
                        dblBaseStation, dblFPIntersectStation, dblFPIntersectElevation, _
                        adblBankGeomX(), adblBankGeomZ())
'
' Set and store the initial angle range and store initial Factor of Safety
    dblNewAngleRange = (dblMaxAngle - dblMinAngle)
    dblAngleRangeStored = dblNewAngleRange
    dblBestFoSStored = dblBestFoS
'
'------------------------------------- START FIRST LOOP -------------------------------------
    Do
      blnBetter = False
      dblOldAngleRange = dblNewAngleRange
'
' Determine the failure angle and output it to the spreadsheet
'
      Randomize
      dblRandAngle = (Rnd() - 0.5) * dblNewAngleRange
      For intSearch = -1 To 1 Step 2
        If blnBetter Then
          dblNewFailureAngle = dblBestFailureAngle + 2 * dblRandAngle * intSearch
        Else
          dblNewFailureAngle = dblBestFailureAngle + dblRandAngle * intSearch
        End If
        If dblNewFailureAngle > dblMaxAngle Then
          dblNewFailureAngle = dblMaxAngle 'dblBestFailureAngle - 0.5 * Rnd() * dblNewAngleRange
        ElseIf dblMinAngle > dblNewFailureAngle Then
          dblNewFailureAngle = dblMinAngle 'dblBestFailureAngle + 0.5 * Rnd() * dblNewAngleRange
        End If
'
' Compute Fs
        dblNewFoS = ComputeFoS(intIteration, 1, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), adblCPrime(), _
                    adblFriction(), adblPhib(), dblBaseStation, dblBaseElevation, dblNewFailureAngle, _
                    dblFPIntersectStation, dblFPIntersectElevation, dblWaterElevation, _
                    dblWaterBankIntersectStation, adblConfiningForce(), adblConfiningAngle(), adblWeight(), _
                    intOutputRow, intOutputColumn)
'
' Compare with stored value and store optimal values
        If (dblNewFoS < dblBestFoS) Then
          blnBetter = True
          dblBestFoS = dblNewFoS
          dblBestFailureAngle = dblNewFailureAngle
        End If
      Next intSearch
      If blnBetter Then
        dblNewAngleRange = dblOldAngleRange * 5 / 3
      Else
        dblNewAngleRange = dblOldAngleRange / 3
      End If

    Loop While (dblNewAngleRange > 0.005 * dblAngleRangeStored)
'-------------------------------------- END FIRST LOOP --------------------------------------
'
' Set the minimum angle
'
    dblMinAngle = ComputeMinAngle(intNumberofLayers, dblBaseElevation, adblFriction())
'
' Find the valleyward bank angle. This is the maximum failure plane angle
    dblMaxAngle = ComputeMaxAngle(intIteration, intNumberofLayers, dblBaseElevation, _
                        dblBaseStation, dblFPIntersectStation, dblFPIntersectElevation, _
                        adblBankGeomX(), adblBankGeomZ())
'
' Set the initial angle range
'
    dblNewAngleRange = (dblMaxAngle - dblMinAngle)
    dblAngleRangeStored = dblNewAngleRange
'
'------------------------------------- START SECOND LOOP -------------------------------------
    Do
      blnBetter = False
      dblOldAngleRange = dblNewAngleRange
'
' Determine the failure angle and output it to the spreadsheet
'
      Randomize
      dblRandAngle = (Rnd() - 0.5) * dblNewAngleRange
      For intSearch = -1 To 1 Step 2
        If blnBetter Then
          dblNewFailureAngle = dblBestFailureAngle + 2 * dblRandAngle * intSearch
        Else
          dblNewFailureAngle = dblBestFailureAngle + dblRandAngle * intSearch
        End If
'
' Initialize max angle as min angle
        dblMaxAngle = dblMinAngle
'
' Loop down the bank points to find the first node after the FP intersect point
        intPoint = 1
        Do While (cintMaxNumberofPoints > intPoint)
          If ((Application.WorksheetFunction.Round(adblBankGeomX(intPoint), 6) > _
                Application.WorksheetFunction.Round(dblFPIntersectStation, 6))) Then Exit Do
          intPoint = intPoint + 1
        Loop
'
' Now continue the loop, but work out the angle
        Do While (cintMaxNumberofPoints > intPoint)
          dblLength = adblBankGeomX(intPoint) - dblFPIntersectStation
          If (dblLength < 0.00001) Then
            dblAngle = 0.5 * cdblPi
          Else
            dblAngle = Atn((dblFPIntersectElevation - adblBankGeomZ(intPoint)) / dblLength)
          End If
          If (dblAngle > dblMaxAngle) Then dblMaxAngle = dblAngle
          intPoint = intPoint + 1
        Loop
'
' Determine the failure angle and output it to the spreadsheet
'
        If dblNewFailureAngle > dblMaxAngle Then
          dblNewFailureAngle = dblMaxAngle 'dblBestFailureAngle - 0.5 * Rnd() * dblNewAngleRange
        ElseIf dblMinAngle > dblNewFailureAngle Then
          dblNewFailureAngle = dblMinAngle 'dblBestFailureAngle + 0.5 * Rnd() * dblNewAngleRange
        End If
'
' Compute Fs
        dblNewFoS = ComputeFoS(intIteration, 2, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), adblCPrime(), _
                    adblFriction(), adblPhib(), dblBaseStation, dblBaseElevation, dblNewFailureAngle, _
                    dblFPIntersectStation, dblFPIntersectElevation, dblWaterElevation, _
                    dblWaterBankIntersectStation, adblConfiningForce(), adblConfiningAngle(), adblWeight(), _
                    intOutputRow, intOutputColumn)
'
' Compare Factor of Safety with stored value, store optimal values and update angle range
'
        If (dblNewFoS < dblBestFoS) Then
          blnBetter = True
          dblBestFoS = dblNewFoS
          dblBestFailureAngle = dblNewFailureAngle
          dblBestBaseElevation = dblBaseElevation
        End If
      Next intSearch
      If blnBetter Then
        dblNewAngleRange = dblOldAngleRange * 5 / 3
      Else
        dblNewAngleRange = dblOldAngleRange / 3
      End If
    Loop While (dblNewAngleRange > 0.0005 * dblAngleRangeStored)
'-------------------------------------- END SECOND LOOP --------------------------------------
    intIteration = intIteration + 1
  Loop While (Abs(dblBestFoS - dblBestFoSStored) > 0.00001 * (10 ^ -intIteration))
'
' Output Results
'
  Worksheets("Input Geometry").Cells(intOutputRow - 2, intOutputColumn).Value = dblBestBaseElevation
  Worksheets("Input Geometry").Cells(intOutputRow, intOutputColumn).Value = dblBestFailureAngle * 180 / cdblPi
'
' Calculate intersect of failure surface and bank face
'
  Call SetBankShearIntersectStation(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                            dblBestBaseElevation, dblBaseStation, intOutputRow, intOutputColumn)
'
' Determine how many layers span the failure block
'
  intNumberofLayers = NumberOfLayersInBank(dblBestBaseElevation)
'
' Compute confining force and angle. This only needs to be done once for each failure base position
'
  Call SetWaterForce(intIteration, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), _
                        dblBaseStation, dblBestBaseElevation, dblWaterElevation, dblWaterBankIntersectStation, _
                        adblConfiningForce(), adblConfiningAngle())
'
' Calculate intersect of failure surface and floodplain
'
  Call SetFloodplainShearIntersect(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                        dblBaseStation, dblBestBaseElevation, dblBestFailureAngle, _
                        dblFPIntersectStation, dblFPIntersectElevation)
'
' Calculate areas of the layers
'
  Call SetLayerWeight(intIteration, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), _
                        dblBaseStation, dblBestBaseElevation, dblFPIntersectStation, _
                        dblFPIntersectElevation, adblWeight())
'
' gives control of the statusbar back to the programme
'
  Application.StatusBar = False
End Sub

Function ComputeFoS(intIteration As Integer, intLoop As Integer, intNumberofLayers As Integer, adblBankGeomX() As Double, _
                adblBankGeomZ() As Double, adblCPrime() As Double, adblFriction() As Double, _
                adblPhib() As Double, dblBaseStation As Double, dblBaseElevation As Double, _
                dblFailureAngle As Double, dblFPIntersectStation As Double, dblFPIntersectElevation As Double, _
                dblWaterElevation As Double, dblWaterBankIntersectStation As Double, _
                adblConfiningForce() As Double, adblConfiningAngle() As Double, adblWeight() As Double, _
                intOutputRow As Integer, intOutputColumn As Integer) As Double
  
  Dim adblPoreWaterForce(1 To cintNumberofLayers) As Double
  Dim dblDistance As Double
  Dim dblDrivingForces As Double
  Dim dblLength As Double
  Dim dblResistingForces As Double
  Dim dblSumDrivingForces As Double
  Dim dblSumResistingForces As Double
  Dim intLayer As Integer
  
  With Worksheets("Calculations")
'
' Set the failure angle
'
    Worksheets("Input Geometry").Cells(intOutputRow, intOutputColumn).Value = dblFailureAngle * 180 / cdblPi
'
    Select Case intLoop
      Case 1
'
' Calculate intersect of failure surface and bank face
        Call SetBankShearIntersectStation(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                            dblBaseElevation, dblBaseStation, intOutputRow, intOutputColumn)
      Case 2
'
' Calculate intersect of failure surface and bank face
        Call SetBankFaceShearIntersect(intIteration, adblBankGeomX(), adblBankGeomZ(), dblBaseStation, _
                            dblBaseElevation, dblFailureAngle, dblFPIntersectStation, _
                            dblFPIntersectElevation, intOutputRow, intOutputColumn)
    End Select
'
' Determine how many layers span the failure block
'
    intNumberofLayers = NumberOfLayersInBank(dblBaseElevation)
'
' Calculate intersect of failure surface and floodplain
'
    Call SetFloodplainShearIntersect(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                        dblBaseStation, dblBaseElevation, dblFailureAngle, _
                        dblFPIntersectStation, dblFPIntersectElevation)
'
' Compute confining force and angle. This only needs to be done once for each failure base position
'
    Call SetWaterForce(intIteration, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), _
                        dblBaseStation, dblBaseElevation, dblWaterElevation, dblWaterBankIntersectStation, _
                        adblConfiningForce(), adblConfiningAngle())
'
' Compute the pore-water force on the layers
'
    Call SetPoreWaterForce(intIteration, intNumberofLayers, dblBaseElevation, dblFPIntersectElevation, _
                        dblFailureAngle, adblFriction(), adblPhib(), adblPoreWaterForce())
'
' Calculate areas of the layers
'
    Call SetLayerWeight(intIteration, intNumberofLayers, adblBankGeomX(), adblBankGeomZ(), _
                        dblBaseStation, dblBaseElevation, dblFPIntersectStation, _
                        dblFPIntersectElevation, adblWeight())
'
' Check Factor of Safety
    dblSumDrivingForces = 0
    dblSumResistingForces = 0
'
' Sum the driving and resisting forces
'
' EL: This code has changed to zero only those resisting forces on layers whose weight is too small instead
'     of the entire failure block. Also confining resisting forces has been added to this loop (03/25/2013).
    For intLayer = 1 To intNumberofLayers
      dblResistingForces = (adblWeight(intLayer) * Cos(dblFailureAngle) + adblConfiningForce(intLayer) _
                            * Cos(adblConfiningAngle(intLayer) - dblFailureAngle)) * Tan(adblFriction(intLayer) * cdblPi / 180) _
                            - adblPoreWaterForce(intLayer)
      If 0 > dblResistingForces Then dblResistingForces = 0
      dblDrivingForces = adblWeight(intLayer) * Sin(dblFailureAngle) _
                            - adblConfiningForce(intLayer) * Sin(adblConfiningAngle(intLayer) - dblFailureAngle)
'
' Sum the weight and pore-water components (W cos b tan f' + S tan fb or U tan f')
      dblSumResistingForces = dblSumResistingForces + dblResistingForces
      dblSumDrivingForces = dblSumDrivingForces + dblDrivingForces
    Next intLayer
'
' Prevent positive pore-water pressure from exceeding the weight of the block
'    If 0 > dblSumResistingForces Then dblSumResistingForces = 0
'
' Now add the remaining resisting components (c'L + P cos(a-b) tan f')
    For intLayer = 1 To intNumberofLayers
'
' First, compute length of failure plane within this layer
      If (dblFPIntersectElevation >= .Cells(intLayer + 4, 17).Value) Then
        dblLength = (.Cells(intLayer + 4, 17).Value _
                    - Application.WorksheetFunction.Max(dblBaseElevation, .Cells(intLayer + 5, 17).Value)) _
                    / Sin(dblFailureAngle)
      Else
        dblLength = (dblFPIntersectElevation - .Cells(intLayer + 5, 17).Value) / Sin(dblFailureAngle)
      End If
      If (0 > dblLength) Then dblLength = 0
'
' Now do the summation ' EL: Confining force effects moved into the loop above (03/25/2013)
      dblSumResistingForces = dblSumResistingForces + adblCPrime(intLayer) * dblLength
    Next intLayer
'
' EL: Made the below more general as this states that confining force exceeds weight of bank material
'     and bank is stable (03/25/2013)
' If Denominator of Factor of Safety equation <= 0 Then set it to the Failure Angle
'
    If dblSumDrivingForces <= 0 Then dblSumDrivingForces = -1
'
' Calculate the Factor of Safety
'
    ComputeFoS = dblSumResistingForces / dblSumDrivingForces
    If (ComputeFoS <= 0) Then ComputeFoS = 99999999
    
  End With
End Function

Function ComputeMaxAngle(intIteration As Integer, intNumberofLayers As Integer, dblBaseElevation As Double, _
                        dblBaseStation As Double, dblFPIntersectStation As Double, _
                        dblFPIntersectElevation As Double, adblBankGeomX() As Double, _
                        adblBankGeomZ() As Double) As Double
'
' Find the valleyward bank angle. This is the maximum failure plane angle
'
  Dim dblLength As Double
  Dim dblAngle As Double
  Dim dblMaxAngle As Double
  Dim dblReducedAngle As Double

  Dim intLayer As Integer
  Dim intLimitingPoint As Integer
  Dim intPoint As Integer
'
' Initialize max angle as 90 degrees
  dblMaxAngle = 0.5 * cdblPi
'
' Loop down the bank points to find the first node above the failure plane base
  intPoint = 1
  Do While (cintMaxNumberofPoints > intPoint)
    If ((Application.WorksheetFunction.Round(dblBaseElevation, 6) >= _
        Application.WorksheetFunction.Round(adblBankGeomZ(intPoint), 6))) Then Exit Do
    intPoint = intPoint + 1
  Loop
  intPoint = intPoint - 1
'
' Loop up the bank points from the first node above the failure plane base to the second node,
' calculating the minimum angle of the bank (this is the max failure plane angle)
  intLimitingPoint = 1
  Do While (intPoint > 1)
    dblLength = dblBaseStation - adblBankGeomX(intPoint)
    If (dblLength < 0.00001) Then
      dblAngle = 0.5 * cdblPi
    Else
      dblAngle = Atn((adblBankGeomZ(intPoint) - dblBaseElevation) / dblLength)
    End If
    If (dblMaxAngle > dblAngle) Then
      intLimitingPoint = intPoint
      dblMaxAngle = dblAngle
'    Else
'
' Bank angle steepens- Found the minimum
'      Exit Do
    End If
    intPoint = intPoint - 1
  Loop
'
' Reduce the maximum angle: minimum angle difference is 2 degrees
'
  dblReducedAngle = cdblPi / 90
  If (2 > intLimitingPoint) Then
'
' Calculate intersect of failure surface and floodplain
'
    Call SetFloodplainShearIntersect(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                        dblBaseStation, dblBaseElevation, dblMaxAngle, _
                        dblFPIntersectStation, dblFPIntersectElevation)
'
' Minimum angle difference is 2 degrees
    If (cdblMinFailureWidth > adblBankGeomX(2) - dblFPIntersectStation) Then _
        dblReducedAngle = Atn(Abs(adblBankGeomX(2) - dblBaseStation + cdblMinFailureWidth) _
                            / (dblFPIntersectElevation - dblBaseElevation))
  End If
    
  If ((0.5 * cdblPi > dblMaxAngle) Or (dblReducedAngle > cdblPi / 90)) Then
    dblMaxAngle = dblMaxAngle - dblReducedAngle
  Else
    dblMaxAngle = 0.5 * cdblPi
  End If
  ComputeMaxAngle = dblMaxAngle
End Function

Function ComputeMinAngle(intNumberofLayers As Integer, dblBaseElevation As Double, _
                        adblFriction() As Double) As Double
'
' Compute the minimum angle for a given base elevation
'
' Calculate the weighted mean phi prime value. This is the minimum failure plane angle.
'
  Dim dblLength As Double
  Dim dblSumLength As Double
  Dim intLayer As Integer
'
' Do calculation over the whole of the bank profile
'
  ComputeMinAngle = 0#
  dblSumLength = 0#
  With Worksheets("Calculations")
    For intLayer = 1 To intNumberofLayers - 1
      dblLength = .Cells(4 + intLayer, 17).Value - .Cells(5 + intLayer, 17).Value
      dblSumLength = dblSumLength + dblLength
      ComputeMinAngle = ComputeMinAngle + adblFriction(intLayer) * dblLength
    Next intLayer
    dblLength = .Cells(4 + intLayer, 17).Value - dblBaseElevation
    dblSumLength = dblSumLength + dblLength
    ComputeMinAngle = ComputeMinAngle + adblFriction(intLayer) * dblLength
    ComputeMinAngle = ComputeMinAngle * cdblPi / (180 * dblSumLength)
  End With
'
End Function

Sub ReadBankGeometry(adblBankGeomX() As Double, adblBankGeomZ() As Double, intTopToePoint As Integer)
'
' This procedure reads in the bank geometry from the Input Geometry worksheet
'
  Dim intReadPoint As Integer
  Dim intResponse As Integer
  Dim intRow As Integer
  Dim strErrMsg As String
  Dim strErrMsg1 As String
'
' Error Message
'
  strErrMsg = "Please check the geometric data you have entered and retry"
  strErrMsg1 = "Use the tick boxes to select a point at the top of the bank toe"
'
' Read in the Geometry as inputted
'
  intReadPoint = 1
  If (Worksheets("Input Geometry").Cells(109, 3).Value = 2) Then intTopToePoint = 17
  For intRow = 114 To 114 + cintMaxNumberofPoints - 1
    If (Worksheets("Input Geometry").Cells(intRow, 5).Value = "") Then Exit For
    If (Worksheets("Input Geometry").Cells(intRow, 7).Value = True) Then intTopToePoint = intReadPoint
    If Not IsNumeric(Worksheets("Input Geometry").Cells(intRow, 3).Value) Then
      intResponse = MsgBox(strErrMsg, vbInformation, "Invalid or absent geometric data!")
      End
    End If
    adblBankGeomX(intReadPoint) = Worksheets("Input Geometry").Cells(intRow, 3).Value
    adblBankGeomZ(intReadPoint) = Worksheets("Input Geometry").Cells(intRow, 5).Value
    intReadPoint = intReadPoint + 1
  Next intRow
'
' Check that the user has selected only one toe point
'
  If (intTopToePoint = 0) Then
    intResponse = MsgBox(strErrMsg1, vbInformation, "Error!")
    End
  End If
  Do While (cintMaxNumberofPoints >= intReadPoint)
    adblBankGeomX(intReadPoint) = -99999999
    adblBankGeomZ(intReadPoint) = -99999999
    intReadPoint = intReadPoint + 1
  Loop
End Sub

Sub RemoveCrossingLines(adblBankGeomX() As Double, adblBankGeomZ() As Double, ByVal intPoint As Integer)
'
' This procedure checks whether two parts of the bank profile are crossing or not
' and reorders points accordingly
'
' The code is based on the simultaneous solution of two equations:
' Pa = P1 + dblSlopeA (P2-P1)
' Pb = P3 + dblSlopeB (P4-P3)
'
' where line 1 is composed of points P1 and P2 and line 2 is composed of points P3 and P4.
'
' dblSlopeA/B is the value by which the x and y legs of the triangle formed by each line are
' multiplied to find a point on the line.
'
' The two equations can be expanded to their x/y components:
' Pa.x = p1.x + dblSlopeA(p2.x - p1.x)
' Pa.y = p1.y + dblSlopeA(p2.y - p1.y)
'
' Pb.x = p3.x + dblSlopeB(p4.x - p3.x)
' Pb.y = p3.y + dblSlopeB(p4.y - p3.y)
'
' Equating Pa.x and Pb.x and Pa.y and Pb.y,
'
' p1.x + dblSlopeA(p2.x - p1.x) = p3.x + dblSlopeB(p4.x - p3.x)
' p1.y + dblSlopeA(p2.y - p1.y) = p3.y + dblSlopeB(p4.y - p3.y)
'
' dblSlopeA and dblSlopeB can then be solved for

'  Dim point(1 To 2) As Double
  
  Dim adblReorderedPointsX() As Double
  Dim adblReorderedPointsZ() As Double
  Dim blnIntersect As Boolean
  Dim dblDenominator As Double
  Dim dblNumeratorA As Double
  Dim dblNumeratorB As Double
  Dim dblSlopeA As Double
  Dim dblSlopeB As Double
  Dim intFirstReorderedPoint As Integer
  Dim intInnerLoopPoint As Integer
'
' Initialize
  blnIntersect = False
  
  intInnerLoopPoint = intPoint + 1
  Do While ((adblBankGeomX(intInnerLoopPoint) <> -99999999) And (adblBankGeomZ(intInnerLoopPoint) <> -99999999) _
            And (cintMaxNumberofPoints > intInnerLoopPoint))
'
' Compute the denominator
    dblDenominator = (adblBankGeomZ(intInnerLoopPoint + 1) - adblBankGeomZ(intInnerLoopPoint)) _
                        * (adblBankGeomX(intPoint + 1) - adblBankGeomX(intPoint)) _
                        - (adblBankGeomX(intInnerLoopPoint + 1) - adblBankGeomX(intInnerLoopPoint)) _
                        * (adblBankGeomZ(intPoint + 1) - adblBankGeomZ(intPoint))
'
' Compute the two numerators
    dblNumeratorA = (adblBankGeomX(intInnerLoopPoint + 1) - adblBankGeomX(intInnerLoopPoint)) _
                        * (adblBankGeomZ(intPoint) - adblBankGeomZ(intInnerLoopPoint)) _
                        - (adblBankGeomZ(intInnerLoopPoint + 1) - adblBankGeomZ(intInnerLoopPoint)) _
                        * (adblBankGeomX(intPoint) - adblBankGeomX(intInnerLoopPoint))
    dblNumeratorB = (adblBankGeomX(intPoint + 1) - adblBankGeomX(intPoint)) _
                        * (adblBankGeomZ(intPoint) - adblBankGeomZ(intInnerLoopPoint)) _
                        - (adblBankGeomZ(intPoint + 1) - adblBankGeomZ(intPoint)) _
                        * (adblBankGeomX(intPoint) - adblBankGeomX(intInnerLoopPoint))
'
' Avoid division by zero. This indicates that the lines are parallel or coincidental
      If (Application.WorksheetFunction.Round(dblDenominator, 6) <> 0) Then
'
' Compute the slopes
      dblSlopeA = dblNumeratorA / dblDenominator
      dblSlopeB = dblNumeratorB / dblDenominator
'
' The fractional point will be between 0 and 1 inclusive if the lines intersect. If the fractional
' calculation is larger than 1 or smaller than 0 the lines would need to be longer to intersect.
      If (dblSlopeA > 0# And dblSlopeA < 1# And dblSlopeB > 0# And dblSlopeB < 1#) Then
'        point(1) = adblBankGeomX(intPoint) + dblSlopeA * (adblBankGeomX(intPoint + 1) - adblBankGeomX(intPoint))
'        point(2) = adblBankGeomZ(intPoint) + dblSlopeA * (adblBankGeomZ(intPoint + 1) - adblBankGeomZ(intPoint))
        intFirstReorderedPoint = intPoint + 1
        blnIntersect = True
        ReDim adblReorderedPointsX(1 To intInnerLoopPoint - intPoint) As Double
        ReDim adblReorderedPointsZ(1 To intInnerLoopPoint - intPoint) As Double
        Exit Do
      End If
    End If
    intInnerLoopPoint = intInnerLoopPoint + 1
  Loop
  If blnIntersect Then
    For intPoint = intFirstReorderedPoint To intInnerLoopPoint
      adblReorderedPointsX(intInnerLoopPoint - intPoint + 1) = adblBankGeomX(intPoint)
      adblReorderedPointsZ(intInnerLoopPoint - intPoint + 1) = adblBankGeomZ(intPoint)
    Next intPoint
    For intPoint = intFirstReorderedPoint To intInnerLoopPoint
      adblBankGeomX(intPoint) = adblReorderedPointsX(intPoint - intFirstReorderedPoint + 1)
      adblBankGeomZ(intPoint) = adblReorderedPointsZ(intPoint - intFirstReorderedPoint + 1)
    Next intPoint
  End If
End Sub

Sub SetBankFaceShearIntersect(intIteration As Integer, adblX() As Double, adblZ() As Double, _
                                dblBaseStation As Double, dblBaseElevation As Double, dblAngle As Double, _
                                dblTopStation As Double, dblTopElevation As Double, _
                                intOutputRow As Integer, intOutputColumn As Integer)
'
' This procedure calculates the intersect of failure surface and bank profile
' for given floodplain intersect and angle of slip surface
'
' Variable declarations
'
  Dim dblDistance As Double
  Dim dblElevation1 As Double
  Dim dblElevation2 As Double
  Dim dblStation1 As Double
  Dim dblStation2 As Double
  Dim dblTngAngle As Double
  Dim dblTngFailureAngle As Double
  Dim dblTngBankAngle As Double
  Dim intPoint As Integer
'
' Set tangent of the failure surface
'
  dblTngFailureAngle = Tan(-dblAngle)
'
' If failure angle is 90 degrees, do not calculate dblBaseStation
'
  If (0.5 * cdblPi > dblAngle) Then
'
' Could insert a loop to find the first channelward node after fp intersect
    intPoint = 1
    Do While (cintMaxNumberofPoints > intPoint)
      intPoint = intPoint + 1
      dblDistance = adblX(intPoint) - dblTopStation
      If (Abs(dblDistance) < 0.00001) Then dblDistance = 0.00001
      dblTngAngle = (adblZ(intPoint) - dblTopElevation) / dblDistance
      If ((Application.WorksheetFunction.Round(dblTngFailureAngle, 6) >= Application.WorksheetFunction.Round(dblTngAngle, 6)) _
        Or (dblTngAngle >= 0)) Then Exit Do
    Loop
    dblStation1 = adblX(intPoint - 1)
    dblStation2 = adblX(intPoint)
    dblElevation1 = adblZ(intPoint - 1)
    dblElevation2 = adblZ(intPoint)
    If dblStation1 = dblStation2 Then
      dblTngBankAngle = 999999
    Else
      dblTngBankAngle = (dblElevation1 - dblElevation2) / (dblStation1 - dblStation2)
    End If
'
' Calculate station and elevation of intersection point and output it
'
    dblBaseStation = (dblElevation1 - dblTopElevation - dblTngBankAngle * dblStation1 _
                      + dblTopStation * dblTngFailureAngle) / (dblTngFailureAngle - dblTngBankAngle)
    dblBaseElevation = dblTopElevation - dblTngFailureAngle * (dblTopStation - dblBaseStation)
  Else
'
' Go to row with top of the bank and search for points in bank profile
' surrounding the layer elevation
'
    intPoint = 0
    Do While (cintMaxNumberofPoints > intPoint + 1)
      intPoint = intPoint + 1
      dblStation1 = adblX(intPoint)
      dblStation2 = adblX(intPoint + 1)
      If dblStation2 > dblBaseStation Then Exit Do
    Loop
    dblElevation1 = adblZ(intPoint)
    dblElevation2 = adblZ(intPoint + 1)
'
' Calculate station of intersection point and write it to the active cell
'
    dblBaseStation = dblTopStation
    dblBaseElevation = dblElevation1 + (dblElevation2 - dblElevation1) * (dblBaseStation - dblStation1) _
                     / (dblStation2 - dblStation1)
  End If
  Worksheets("Input Geometry").Cells(intOutputRow - 2, intOutputColumn).Value = dblBaseElevation
  Worksheets("Calculations").Cells(15, 16).Value = dblBaseStation
  Worksheets("VertSliceCalcs").Cells(25, 16).Value = dblBaseStation
  Worksheets("Calculations").Cells(15, 17).Value = dblBaseElevation
  Worksheets("VertSliceCalcs").Cells(25, 17).Value = dblBaseElevation
End Sub

Sub SetBankGeometry()
'
' SetBankGeometry Macro
'
' This macro sets the geometry of a layered bank and sets the intersect of the water surface and the
' bank face
'
' Author:
'           Robert E. Thomas
'           Civil Engineering,
'           University of Mississipi,
'           University, MS 38677
'       and USDA-ARS-NSL,
'           P.O. Box 1157,
'           Oxford, MS 38655
'
' This macro was modified last on 20/08/2008.
'
' -------------------------------- Declarations --------------------------------
'
  Dim adblBankGeomX(1 To cintMaxNumberofPoints) As Double
  Dim adblBankGeomZ(1 To cintMaxNumberofPoints) As Double
  Dim dblBaseElevation As Double
  Dim dblBaseStation As Double
  Dim dblFailureAngle As Double
  Dim dblFPIntersectStation As Double
  Dim dblFPIntersectElevation As Double
  Dim dblWaterBankIntersectStation As Double
  Dim dblWaterElevation As Double
  Dim intIteration As Integer
  Dim intOutputColumn As Integer
  Dim intOutputRow As Integer
  Dim intResponse As Integer
  Dim intToePoint As Integer
  Dim strErrMsg As String
  Dim strErrMsg1 As String
'
' ---------------------------------- Program -----------------------------------
'
' Error messages
'
  strErrMsg = "The inputted shear surface emerges too low in the bank."
  strErrMsg1 = "The failure plane angle cannot equal zero!"
'
' Delete any chart that appears on the Input Geometry sheet
'
  ActiveSheet.Unprotect ("BSTEMADMINISTRATOR")
  On Error Resume Next
  Worksheets("Input Geometry").ChartObjects.Delete
  On Error GoTo 0
'
' Reprotect worksheet
  ActiveSheet.Protect "BSTEMADMINISTRATOR", DrawingObjects:=True, Contents:=True, Scenarios:=False
'
' Set the correct output locations depending one whether auto geometry or manual geometry
'
  If Worksheets("Input Geometry").Cells(109, 3).Value = 1 Then
    intOutputColumn = 5
    intOutputRow = 46
  Else
    intOutputColumn = 7
    intOutputRow = 28
    If (Worksheets("Input Geometry").Cells(intOutputRow, intOutputColumn).Value = "") Then
      Worksheets("Input Geometry").Cells(intOutputRow - 2, intOutputColumn).Value = ""
    Else
      Worksheets("Input Geometry").Cells(intOutputRow - 2, intOutputColumn).Value = _
        Worksheets("Input Geometry").Cells(130, 5).Value
    End If
  End If
'
' Read inputted bank geometry
'
  Call ReadBankGeometry(adblBankGeomX(), adblBankGeomZ(), intToePoint)
'
' Activate the "Calculations" worksheet
'
  Worksheets("Calculations").Activate
'
' Update the bank geometry
'
  Call SetUpdatedBankGeometry(adblBankGeomX(), adblBankGeomZ(), intToePoint)
'
' Set intersect of water surface with bank profile
'
  dblWaterElevation = Worksheets("Calculations").Cells(63, 2).Value
  Call SetWaterBankIntersect(adblBankGeomX(), adblBankGeomZ(), dblWaterElevation, dblWaterBankIntersectStation)
'
' Check if the auto shear angle option has been selected
'
  If ((Worksheets("Input Geometry").Cells(intOutputRow, intOutputColumn).Value = "") _
       Or ((intOutputColumn = 5) And (Worksheets("Input Geometry").Cells(44, intOutputColumn).Value = ""))) Then
'
' Set the coordinates of the shear plane to be the bank-most node
    Worksheets("Calculations").Cells(15, 16).Value = Worksheets("Calculations").Cells(27, 6).Value
    Worksheets("Calculations").Cells(16, 16).Value = Worksheets("Calculations").Cells(27, 6).Value
    Worksheets("VertSliceCalcs").Cells(25, 16).Value = Worksheets("Calculations").Cells(27, 6).Value
    Worksheets("VertSliceCalcs").Cells(26, 16).Value = Worksheets("Calculations").Cells(27, 6).Value
    Worksheets("Calculations").Cells(15, 17).Value = Worksheets("Calculations").Cells(27, 7).Value
    Worksheets("Calculations").Cells(16, 17).Value = Worksheets("Calculations").Cells(27, 7).Value
    Worksheets("VertSliceCalcs").Cells(25, 17).Value = Worksheets("Calculations").Cells(27, 7).Value
    Worksheets("VertSliceCalcs").Cells(26, 17).Value = Worksheets("Calculations").Cells(27, 7).Value
    Worksheets("VertSliceCalcs").Cells(27, 16).Value = ""
    Worksheets("VertSliceCalcs").Cells(27, 17).Value = ""
  Else
'
' Store the inputted base elevation and failure plane angle
    dblBaseElevation = Worksheets("Input Geometry").Cells(138, 5).Value
    dblFailureAngle = Worksheets("Input Geometry").Cells(140, 5).Value * cdblPi / 180
'
' Check that the base elevation is reasonable
'
    If (Worksheets("Input Geometry").Cells(135, 5).Value > dblBaseElevation) Then
      MsgBox strErrMsg, vbInformation, "Error!"
      Worksheets("Input Geometry").Activate
      Exit Sub
    ElseIf (dblFailureAngle = 0) Then
      MsgBox strErrMsg1, vbInformation, "Error!"
      Worksheets("Input Geometry").Activate
      Exit Sub
    Else
      Worksheets("Input Geometry").Cells(intOutputRow, intOutputColumn).Value = _
                                                    dblFailureAngle * 180 / cdblPi
'
' Calculate intersect of failure surface and bank face
'
      Call SetBankShearIntersectStation(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                                            dblBaseElevation, dblBaseStation, _
                                            intOutputRow, intOutputColumn)
'
' Calculate intersect of failure surface and floodplain
'
      Call SetFloodplainShearIntersect(intIteration, adblBankGeomX(), adblBankGeomZ(), _
                                        dblBaseStation, dblBaseElevation, dblFailureAngle, _
                                        dblFPIntersectStation, dblFPIntersectElevation)
    End If
  End If
'
' Set applied shear stresses equal to zero
'
  Range(Worksheets("Toe Model").Cells(45, 2), Worksheets("Toe Model").Cells(67, 2)).ClearContents
  Worksheets("Toe Model Output").Cells(24, 15).ClearContents
'
' Activate the "Bank Material" worksheet
'
  Worksheets("Bank Material").Activate
End Sub

Sub SetBankLayerIntersect(adblX() As Double, adblZ() As Double)
'
' This procedure calculates the intersect of the layers and bank profile
' for given base elevation
'
' Variable declarations
'
  Dim dblElevation1 As Double
  Dim dblElevation2 As Double
  Dim dblStation1 As Double
  Dim dblStation2 As Double
  Dim dblTopElevation As Double
  Dim dblTopStation As Double
  Dim intLayer As Integer
  Dim intPoint As Integer
'
' Loop over the layers
'
  For intLayer = 1 To cintNumberofLayers
'
' Get the elevation of the layer
'
    dblTopElevation = Worksheets("Calculations").Cells(intLayer + 5, 17).Value
'
' Go to row with top of the bank and search for points in bank profile
' surrounding the layer elevation
'
    intPoint = 0
    Do While (cintMaxNumberofPoints > intPoint + 1)
      intPoint = intPoint + 1
      dblElevation1 = adblZ(intPoint)
      dblElevation2 = adblZ(intPoint + 1)
      If dblElevation2 < dblTopElevation Then Exit Do
    Loop
    dblStation1 = adblX(intPoint)
    dblStation2 = adblX(intPoint + 1)
    If dblTopElevation < dblElevation2 Then
      Worksheets("Calculations").Cells(intLayer + 5, 16).Value = dblStation1
    Else
'
' Calculate station of intersection point and write it to the active cell
'
      dblTopStation = dblStation1 + (dblStation2 - dblStation1) * (dblTopElevation - dblElevation1) _
                     / (dblElevation2 - dblElevation1)
      Worksheets("Calculations").Cells(intLayer + 5, 16).Value = dblTopStation
    End If
  Next intLayer
End Sub

Sub SetBankShearIntersectStation(intIteration As Integer, adblX() As Double, adblZ() As Double, _
                                    dblBaseElevation As Double, dblBaseStation As Double, _
                                    intOutputRow As Integer, intOutputColumn As Integer)
'
' This procedure calculates the intersect of the failure surface and bank profile
' for given base elevation
'
' Variable declarations
'
    Dim dblElevation1 As Double
    Dim dblElevation2 As Double
    Dim dblStation1 As Double
    Dim dblStation2 As Double
    Dim intPoint As Integer
'
' Go to row with top of the bank and search for points in bank profile
' surrounding the failure base elevation
'
    intPoint = 0
    Do While (cintMaxNumberofPoints > intPoint + 1)
      intPoint = intPoint + 1
      dblElevation1 = adblZ(intPoint)
      dblElevation2 = adblZ(intPoint + 1)
      If dblElevation2 <= dblBaseElevation Then Exit Do
    Loop
    dblStation1 = adblX(intPoint)
    dblStation2 = adblX(intPoint + 1)
'
' Calculate station of intersection point and output it
'
    dblBaseStation = dblStation1 + (dblStation2 - dblStation1) _
                     * (dblBaseElevation - dblElevation1) / (dblElevation2 - dblElevation1)
    Worksheets("Calculations").Cells(15, 16).Value = dblBaseStation
    Worksheets("VertSliceCalcs").Cells(25, 16).Value = dblBaseStation
    Worksheets("Calculations").Cells(15, 17).Value = dblBaseElevation
    Worksheets("VertSliceCalcs").Cells(25, 17).Value = dblBaseElevation
    Worksheets("Input Geometry").Cells(intOutputRow - 2, intOutputColumn).Value = dblBaseElevation
'
End Sub

Sub SetFloodplainShearIntersect(intIteration As Integer, adblX() As Double, adblZ() As Double, _
                                dblBaseStation As Double, dblBaseElevation As Double, dblAngle As Double, _
                                dblTopStation As Double, dblTopElevation As Double)
'
' This procedure calculates the intersect of failure surface and floodplain
' for given base and angle of slip surface
'
' Variable declarations
'
  Dim dblDistance As Double
  Dim dblElevation1 As Double
  Dim dblElevation2 As Double
  Dim dblStation1 As Double
  Dim dblStation2 As Double
  Dim dblTngAngle As Double
  Dim dblTngFailureAngle As Double
  Dim dblTngFPAngle As Double
  Dim intPoint As Integer
  Dim strErrorMessage As String
'
' Set error message
'
  strErrorMessage = "The model is unable to determine the intersect of the slip surface with the " _
                 & "floodplain with the present bank geometry. Adjusting the position of Point A..." _
'
' Set tangent of the failure surface
'
  dblTngFailureAngle = Tan(dblAngle)
'
' If failure angle is 90 degrees, do not calculate dblTopStation
'
  If (0.5 * cdblPi > dblAngle) Then
    intPoint = cintMaxNumberofPoints - 1
    Do While (intPoint > 1)
      If ((Application.WorksheetFunction.Round(adblZ(intPoint), 6) >= Application.WorksheetFunction.Round(dblBaseElevation, 6)) And _
            (Application.WorksheetFunction.Round(dblBaseStation, 6) > Application.WorksheetFunction.Round(adblX(intPoint), 6))) Then Exit Do
      intPoint = intPoint - 1
    Loop
    Do While (intPoint > 1)
      dblDistance = dblBaseStation - adblX(intPoint)
      If (Abs(dblDistance) < 0.00001) Then dblDistance = 0.00001
      dblTngAngle = (adblZ(intPoint) - dblBaseElevation) / dblDistance
      If (0 >= dblTngAngle) Then dblTngAngle = 999999
      If dblTngFailureAngle >= dblTngAngle Then Exit Do
      intPoint = intPoint - 1
    Loop
    
    dblStation1 = adblX(intPoint)
    dblStation2 = adblX(intPoint + 1)
    dblElevation1 = adblZ(intPoint)
    dblElevation2 = adblZ(intPoint + 1)
'    intResponse = MsgBox(strErrorMessage, vbOKOnly, "Error!")
'    Worksheets("Input Geometry").Activate
'    End
    dblTngFPAngle = (dblElevation1 - dblElevation2) / (dblStation1 - dblStation2)
'
' Calculate station and elevation of intersection point and output it
'
    dblTopStation = (dblBaseElevation - dblElevation2 + dblBaseStation * dblTngFailureAngle _
                  + dblStation2 * dblTngFPAngle) / (dblTngFailureAngle + dblTngFPAngle)
    dblTopElevation = dblBaseElevation - dblTngFailureAngle * (dblTopStation - dblBaseStation)
    If adblX(1) > dblTopStation Then
      adblX(1) = dblTopStation
      adblZ(1) = dblTopElevation
      Worksheets("Input Geometry").Cells(20, 3).Value = dblTopStation
      Worksheets("Input Geometry").Cells(20, 5).Value = dblTopElevation
    End If
  Else
'
' Go to row with top of the bank and search for points in bank profile
' surrounding the base station
'
    intPoint = 0
    Do While (cintMaxNumberofPoints > intPoint + 1)
      intPoint = intPoint + 1
      dblStation1 = adblX(intPoint)
      dblStation2 = adblX(intPoint + 1)
      If dblStation2 > dblBaseStation Then Exit Do
    Loop
    dblElevation1 = adblZ(intPoint)
    dblElevation2 = adblZ(intPoint + 1)
'
' Calculate station of intersection point and write it to the active cell
'
    dblTopStation = dblBaseStation
    dblTopElevation = dblElevation1 + (dblElevation2 - dblElevation1) * (dblTopStation - dblStation1) _
                     / (dblStation2 - dblStation1)
  End If
  Worksheets("Calculations").Cells(16, 16).Value = dblTopStation
  Worksheets("VertSliceCalcs").Cells(26, 16).Value = dblTopStation
  Worksheets("Calculations").Cells(16, 17).Value = dblTopElevation
  Worksheets("VertSliceCalcs").Cells(26, 17).Value = dblTopElevation
  Worksheets("VertSliceCalcs").Cells(27, 16).Value = ""
  Worksheets("VertSliceCalcs").Cells(27, 17).Value = ""
End Sub

Sub SetLayerWeight(intIteration As Integer, intNumberofLayers As Integer, adblBankGeomX() As Double, _
                adblBankGeomZ() As Double, dblBaseStation As Double, dblBaseElevation As Double, _
                dblFPIntersectStation As Double, dblFPIntersectElevation As Double, adblWeight() As Double)
'
' This procedure calculates the weight of each soil contained in the failure
' block.
'
' Variable declarations
'
  Dim adblBulkUnitWeight(1 To cintNumberofLayers) As Double
  Dim adblX(1 To 25) As Double
  Dim adblZ(1 To 25) As Double
  Dim dblArea As Double
  Dim dblElevationBottomLeft As Double
  Dim dblElevationBottomRight As Double
  Dim dblElevationTopLeft As Double
  Dim dblElevationTopRight As Double
  Dim dblStationBottomLeft As Double
  Dim dblStationBottomRight As Double
  Dim dblStationTopLeft As Double
  Dim dblStationTopRight As Double
  Dim dblTopElevation As Double
  Dim intFirstLayer As Integer
  Dim intLayer As Integer
  Dim intPoint As Integer
  Dim intVertex As Integer
'
' Find the first layer within the failure block
'
  intFirstLayer = 1
  For intLayer = intNumberofLayers To 1 Step -1
    dblTopElevation = Worksheets("Calculations").Cells(5 + intLayer, 17).Value
    If (dblTopElevation >= dblFPIntersectElevation) Then
      intFirstLayer = intLayer + 1
      Exit For
    End If
' While we're here, get the bulk unit weight of the layer
    adblBulkUnitWeight(intLayer) = Worksheets("Calculations").Cells(73, 1 + intLayer).Value
  Next intLayer
'
' Assemble vertices of polygon of the area of the soil layer within the failure
' block
'
  For intLayer = intNumberofLayers To intFirstLayer Step -1
'
' Initialise intVertex to zero. If at the bottom of the slip surface, initialise one point only
    intVertex = 0
    If intLayer = intNumberofLayers Then
      adblX(intVertex + 1) = dblBaseStation
      adblZ(intVertex + 1) = dblBaseElevation
      intVertex = intVertex + 1   'increment vertex
    Else
'
' Bottom valley-side intersect of soil layer and slip surface is the top valley-
' side intersect of the soil layer below
'
      adblX(intVertex + 1) = dblStationTopRight
      adblZ(intVertex + 1) = dblElevationTopRight
      adblX(intVertex + 2) = dblStationTopLeft
      adblZ(intVertex + 2) = dblElevationTopLeft
      intVertex = intVertex + 2   'increment vertex
    End If
'
' Initialise the first two points in the next layer: if the top layer and intersect station
' is >= Point B, then only add one node
'
    dblStationTopLeft = Worksheets("Calculations").Cells(21 + intLayer, 16).Value
    dblElevationTopLeft = Worksheets("Calculations").Cells(21 + intLayer, 17).Value
    If ((intLayer = intFirstLayer) And (dblFPIntersectStation >= adblBankGeomX(2))) Then
      dblStationTopRight = dblFPIntersectStation
      dblElevationTopRight = dblFPIntersectElevation
    Else
      dblStationTopRight = Worksheets("Calculations").Cells(4 + intLayer, 16).Value
      dblElevationTopRight = Worksheets("Calculations").Cells(4 + intLayer, 17).Value
'
' Top valley-side vertex
'
      adblX(intVertex + 1) = dblStationTopLeft
      adblZ(intVertex + 1) = dblElevationTopLeft
      intVertex = intVertex + 1   'increment vertex
    End If
''
'' Top stream-side vertex
''
'    If (intLayer > intFirstLayer) Or (dblElevationTopRight = Round(dblFPIntersectElevation, 6)) Then
      adblX(intVertex + 1) = dblStationTopRight
      adblZ(intVertex + 1) = dblElevationTopRight
      intVertex = intVertex + 1   'increment vertex
'    End If
'
' Add bank nodes to polygon until a node's elevation equals or drops below the
' elevation of the intersect of bank profile with the bottom of soil layer.
'
    intPoint = cintMaxNumberofPoints - 1 'intUndercutToe
    Do While (intPoint > 1)
      If (adblBankGeomZ(intPoint - 1) > dblElevationTopRight) Then
        Exit Do
      End If
      intPoint = intPoint - 1
    Loop
    Do While (adblBankGeomZ(intPoint) > Worksheets("Calculations").Cells(5 + intLayer, 17).Value _
                And cintMaxNumberofPoints > intPoint And adblBankGeomZ(intPoint) > dblBaseElevation)
      adblX(intVertex + 1) = adblBankGeomX(intPoint)
      adblZ(intVertex + 1) = adblBankGeomZ(intPoint)
      intVertex = intVertex + 1   'increment vertex
      intPoint = intPoint + 1
    Loop
'
' Compute area of failure block and write to spreadsheet
'
    adblWeight(intLayer) = PolygonArea(adblX, adblZ, intVertex)
    Worksheets("Calculations").Cells(35 + intLayer, 4).Value = adblWeight(intLayer)
' Convert area to weight
    adblWeight(intLayer) = adblWeight(intLayer) * adblBulkUnitWeight(intLayer)
  Next intLayer
'
' Set areas and weights for layers not in the failure block to zero
'
  For intLayer = intNumberofLayers + 1 To cintNumberofLayers
    adblWeight(intLayer) = 0
    Worksheets("Calculations").Cells(35 + intLayer, 4).Value = adblWeight(intLayer)
  Next intLayer
  For intLayer = 1 To intFirstLayer - 1
    adblWeight(intLayer) = 0
    Worksheets("Calculations").Cells(35 + intLayer, 4).Value = adblWeight(intLayer)
  Next intLayer
End Sub

Sub SetPoreWaterForce(intIteration As Integer, intNumberofLayers As Integer, dblBaseElevation As Double, _
                        dblFPIntersectElevation As Double, dblFailureAngle As Double, _
                        adblFriction() As Double, adblPhib() As Double, adblPoreWaterForce() As Double)
'
' This procedure calculates the pore-water force acting on each soil layer and adjusts the bulk unit weight of the material
'
' Variable declarations
'
  Const cdblAngularCoeff = -0.063
  
  Dim dblLayerBottomElevation As Double
  Dim dblLayerTopElevation As Double
  Dim dblLength As Double
  Dim intLayer As Integer
  
  With Worksheets("Calculations")
  
  For intLayer = 1 To intNumberofLayers
'
' First compute pore-water pressure
'
' EL 03/27/2013: Value is pre-calculated in the Input Geometry worksheet
    dblLayerTopElevation = .Cells(intLayer + 4, 17).Value
    dblLayerBottomElevation = .Cells(intLayer + 5, 17).Value
    If (dblLayerTopElevation > dblBaseElevation) Then
      adblPoreWaterForce(intLayer) = Worksheets("Input Geometry").Cells(91 + intLayer, 13).Value
    Else
      adblPoreWaterForce(intLayer) = 0
    End If
'
' Compute length of failure plane within this layer
    If (dblFPIntersectElevation >= dblLayerTopElevation) Then
      dblLength = (dblLayerTopElevation _
                    - Application.WorksheetFunction.Max(dblBaseElevation, dblLayerBottomElevation)) _
                    / Sin(dblFailureAngle)
    Else
      dblLength = (dblFPIntersectElevation - dblLayerBottomElevation) / Sin(dblFailureAngle)
    End If
    If (0 > dblLength) Then dblLength = 0
'
' Now compute matric suction or positive pwp
    If (adblPoreWaterForce(intLayer) > 0) Then
      adblPoreWaterForce(intLayer) = -dblLength * adblPoreWaterForce(intLayer) * Tan(adblPhib(intLayer) * cdblPi / 180)
    Else
      adblPoreWaterForce(intLayer) = -dblLength * adblPoreWaterForce(intLayer) * Tan(adblFriction(intLayer) * cdblPi / 180)
    End If
  Next intLayer
  
  End With
End Sub

Sub SetUnderCutIndex(adblX() As Double, adblZ() As Double, intUndercut As Integer, intUndercutToe As Integer, _
                       dblMaxUndercut As Double)
'
' This procedure sets the index of the undercut toe if present.
'
' Variable declarations
'
  Dim blnDirection As Boolean
  Dim dblDistance As Double
  Dim dblMaxStation As Double
  Dim dblMinStation As Double
  Dim dblToeElevation As Double
  Dim dblToeStation As Double
  Dim dblTopElevation As Double
  Dim dblTopStation As Double
  Dim intPoint As Integer
  Dim intToePoint As Integer
'
' Find top and base of failure surface and initialize indices
'
  dblTopStation = adblX(1)
  dblTopElevation = adblZ(1)
  dblToeStation = adblX(cintMaxNumberofPoints)
  dblToeElevation = adblZ(cintMaxNumberofPoints)
  intToePoint = cintMaxNumberofPoints
  intUndercut = cintMaxNumberofPoints
  intUndercutToe = cintMaxNumberofPoints
  dblMaxUndercut = 0
  dblMinStation = dblToeStation
  dblMaxStation = dblToeStation
  blnDirection = False
  intPoint = cintMaxNumberofPoints
'
' Find the point on the bank with the largest overhang
'
  Do While (intPoint > 1)
    If (Application.WorksheetFunction.Round(adblX(intPoint), 6) >= Application.WorksheetFunction.Round(adblX(intPoint - 1), 6) And Not blnDirection) Then
'
' Channel bank continues to be laid backward.  Increment the toepoint.
'
      intToePoint = intPoint
'
    ElseIf (Application.WorksheetFunction.Round(adblX(intPoint), 6) < Application.WorksheetFunction.Round(adblX(intPoint - 1), 6) And Not blnDirection) Then
'
' Channel bank face changes from being laid backward to overhanging the channel.
' Set the valleyside extent of the overhang.
'
      dblMinStation = adblX(intPoint)
      dblMaxStation = adblX(intPoint - 1)
      blnDirection = True
      intUndercutToe = intPoint
'
    ElseIf (Application.WorksheetFunction.Round(adblX(intPoint), 6) <= Application.WorksheetFunction.Round(adblX(intPoint - 1), 6) And blnDirection) Then
'
' Channel bank overhang is increasing, update the streamside extent of the overhang.
'
      dblMaxStation = adblX(intPoint - 1)
'
    ElseIf (Application.WorksheetFunction.Round(adblX(intPoint), 6) > Application.WorksheetFunction.Round(adblX(intPoint - 1), 6) And blnDirection) Then
'
' Channel bank face changes from being overhanging the channel to laid backward.
' Check how much the bank segment is undercut, and if this is the max overhang.
'
      dblDistance = dblMaxStation - dblMinStation
      If (dblDistance > dblMaxUndercut) Then
        dblMaxUndercut = dblDistance
        intUndercut = intPoint
      End If
      blnDirection = False
    End If
    intPoint = intPoint - 1
  Loop
'
End Sub

Sub SetUpdatedBankGeometry(adblBankGeomX() As Double, adblBankGeomZ() As Double, intTopToePoint As Integer)
'
' This procedure interpolates a complete profile from a partial profile entered by the user
'
  Dim dblDistance As Double
  Dim dblMaxDistance As Double
  Dim dblMinElevation As Double
  Dim intInsertPoint As Integer
  Dim intNumberofLayers As Integer
  Dim intNumberofPoints As Integer
  Dim intLayer As Integer
  Dim intPoint As Integer
'
' Untick top of toe check box
'
  Worksheets("Input Geometry").Cells(113 + intTopToePoint, 7).Value = "FALSE"
'
' Check that there are no duplicate points (two consecutive points within +/- 1 mm of each other)
'
  intInsertPoint = 2
  intNumberofPoints = 2
  Do While ((adblBankGeomX(intNumberofPoints) <> -99999999) And (adblBankGeomZ(intNumberofPoints) <> -99999999) _
            And (cintMaxNumberofPoints > intNumberofPoints))
    If 0.001 > Sqr((adblBankGeomX(intNumberofPoints) - adblBankGeomX(intNumberofPoints - 1)) ^ 2 _
        + (adblBankGeomZ(intNumberofPoints) - adblBankGeomZ(intNumberofPoints - 1)) ^ 2) Then
      intPoint = intNumberofPoints - 1
'
' Replace duplicate point with the next point on the profile
      Do While ((adblBankGeomX(intPoint) <> -99999999) And (adblBankGeomZ(intPoint) <> -99999999) _
            And (cintMaxNumberofPoints > intPoint))
        adblBankGeomX(intPoint) = adblBankGeomX(intPoint + 1)
        adblBankGeomZ(intPoint) = adblBankGeomZ(intPoint + 1)
        intPoint = intPoint + 1
      Loop
'
' Overwrite the last point with -99999999
      adblBankGeomX(cintMaxNumberofPoints) = -99999999
      adblBankGeomZ(cintMaxNumberofPoints) = -99999999
'
' Hold intNumberofPoints at the removed point until there are no more duplicate points
      intNumberofPoints = intNumberofPoints - 1
'
' Move intTopToePoint up the bank if points above it are duplicated
      If (intTopToePoint > intNumberofPoints) Then intTopToePoint = intTopToePoint - 1
    End If
    intNumberofPoints = intNumberofPoints + 1
  Loop
'
' Check that no part of the profile crosses another
'
  For intPoint = 1 To cintMaxNumberofPoints - 1
    Call RemoveCrossingLines(adblBankGeomX(), adblBankGeomZ(), intPoint)
  Next intPoint
'
' Now, set intersects of layers with bank profile
'
  Call SetBankLayerIntersect(adblBankGeomX(), adblBankGeomZ())
'
' Handle the toe first. Loop over the Geometry as inputted. Get the number of inputted
' toe points
'
  intPoint = intTopToePoint
  intNumberofPoints = 1
  Do While (6 >= intNumberofPoints)
    If ((adblBankGeomX(intTopToePoint + intNumberofPoints) = -99999999) _
        And (adblBankGeomZ(intTopToePoint + intNumberofPoints) = -99999999)) Then Exit Do
    intNumberofPoints = intNumberofPoints + 1
  Loop
  intNumberofPoints = intNumberofPoints - 1
'
' Loop over the points until the profile is full
  Do While (5 >= intNumberofPoints)
'
' Determine the insertion location
'
    dblMaxDistance = -99999999
    intInsertPoint = intTopToePoint + 1
    For intPoint = (intTopToePoint + 1) To (intTopToePoint + intNumberofPoints - 1)
      If (Sqr((adblBankGeomX(intPoint) - adblBankGeomX(intPoint - 1)) ^ 2 _
            + (adblBankGeomZ(intPoint) - adblBankGeomZ(intPoint - 1)) ^ 2) > dblMaxDistance) Then
        dblMaxDistance = Sqr((adblBankGeomX(intPoint) - adblBankGeomX(intPoint - 1)) ^ 2 _
                            + (adblBankGeomZ(intPoint) - adblBankGeomZ(intPoint - 1)) ^ 2)
        intInsertPoint = intPoint
      End If
    Next intPoint
'
' Move all the points below intInsertPoint down the point list
'
    For intPoint = (intTopToePoint + intNumberofPoints) To intInsertPoint Step -1
      adblBankGeomX(intPoint + 1) = adblBankGeomX(intPoint)
      adblBankGeomZ(intPoint + 1) = adblBankGeomZ(intPoint)
    Next intPoint
'
' Use the mean of the two surrounding points
'
    adblBankGeomX(intInsertPoint) = 0.5 * (adblBankGeomX(intInsertPoint - 1) + adblBankGeomX(intInsertPoint))
    adblBankGeomZ(intInsertPoint) = 0.5 * (adblBankGeomZ(intInsertPoint - 1) + adblBankGeomZ(intInsertPoint))
    intNumberofPoints = intNumberofPoints + 1
  Loop
'
' Loop over the Geometry as inputted. Get the minimum elevation of the bank portion
'
  dblMinElevation = 99999999
  intPoint = 1
  Do While intTopToePoint >= intPoint
    If ((adblBankGeomX(intPoint) = -99999999) And (adblBankGeomZ(intPoint) = -99999999)) Then Exit Do
    If dblMinElevation > adblBankGeomZ(intPoint) Then
      dblMinElevation = adblBankGeomZ(intPoint)
    End If
    intPoint = intPoint + 1
  Loop
'
' Determine how many layers span the bank
'
  intNumberofLayers = NumberOfLayersInBank(dblMinElevation)
'
' Loop over the points until the profile is full
  Do While (cintMaxNumberofPoints - 6 > intTopToePoint)
'
' Determine the insertion location
'
    dblMaxDistance = -99999999
    For intPoint = intTopToePoint To 3 Step -1
      If (Sqr((adblBankGeomX(intPoint) - adblBankGeomX(intPoint - 1)) ^ 2 _
            + (adblBankGeomZ(intPoint) - adblBankGeomZ(intPoint - 1)) ^ 2) > dblMaxDistance) Then
        dblMaxDistance = Sqr((adblBankGeomX(intPoint) - adblBankGeomX(intPoint - 1)) ^ 2 _
                        + (adblBankGeomZ(intPoint) - adblBankGeomZ(intPoint - 1)) ^ 2)
        intInsertPoint = intPoint
      End If
    Next intPoint
'
' Move all the points below intInsertPoint down the point list
'
    For intPoint = (intTopToePoint + intNumberofPoints) To intInsertPoint Step -1
      adblBankGeomX(intPoint + 1) = adblBankGeomX(intPoint)
      adblBankGeomZ(intPoint + 1) = adblBankGeomZ(intPoint)
    Next intPoint
'
' Loop over the layers and geometry, inserting the layer intersects where appropriate
'
    For intLayer = intNumberofLayers To 1 Step -1
      If (Worksheets("Calculations").Cells(5 + intLayer, 17).Value - 0.000000000000001 > _
            adblBankGeomZ(intInsertPoint)) Then Exit For
    Next intLayer
'
    dblDistance = Sqr((adblBankGeomX(intInsertPoint) - Worksheets("Calculations").Cells(5 + intLayer, 16).Value) ^ 2 _
            + (adblBankGeomZ(intInsertPoint) - Worksheets("Calculations").Cells(5 + intLayer, 17).Value) ^ 2)
    If ((dblMaxDistance > dblDistance) And (dblDistance > 0.001)) Then
      adblBankGeomX(intInsertPoint) = Worksheets("Calculations").Cells(5 + intLayer, 16).Value
      adblBankGeomZ(intInsertPoint) = Worksheets("Calculations").Cells(5 + intLayer, 17).Value
    Else
      adblBankGeomX(intInsertPoint) = 0.5 * (adblBankGeomX(intInsertPoint - 1) + adblBankGeomX(intInsertPoint))
      adblBankGeomZ(intInsertPoint) = 0.5 * (adblBankGeomZ(intInsertPoint - 1) + adblBankGeomZ(intInsertPoint))
    End If
    intTopToePoint = intTopToePoint + 1
  Loop
'
' Final duplicate elevation check and then output the new profile
'
  For intPoint = 2 To cintMaxNumberofPoints
    If (0.000001 > Abs(adblBankGeomZ(intPoint) - adblBankGeomZ(intPoint - 1))) Then _
      adblBankGeomZ(intPoint) = adblBankGeomZ(intPoint - 1) - 0.000001 + (adblBankGeomZ(intPoint) - adblBankGeomZ(intPoint - 1))
  Next intPoint
  For intPoint = 1 To cintMaxNumberofPoints
    Worksheets("Input Geometry").Cells(19 + intPoint, 3).Value = adblBankGeomX(intPoint)
    Worksheets("Input Geometry").Cells(19 + intPoint, 5).Value = adblBankGeomZ(intPoint)
  Next intPoint
  If ((Worksheets("Input Geometry").Cells(109, 3).Value = 2) And _
        (Worksheets("Input Geometry").Cells(28, 7).Value <> "")) Then
    Worksheets("Input Geometry").Cells(44, 5).Value = Worksheets("Input Geometry").Cells(138, 5).Value
    Worksheets("Input Geometry").Cells(46, 5).Value = Worksheets("Input Geometry").Cells(140, 5).Value
  End If
  Worksheets("Input Geometry").Cells(109, 3).Value = 1
  Worksheets("Input Geometry").Cells(130, 7).Value = "TRUE"
End Sub

Sub SetWaterBankIntersect(adblX() As Double, adblZ() As Double, dblWaterElevation As Double, _
                        dblWaterBankIntersectStation As Double)
'
' This procedure calculates the intersect of water surface profile and streambank
'
' Variable declarations
'
  Dim dblElevation1 As Double
  Dim dblElevation2 As Double
  Dim dblMinElevation As Double
  Dim dblStation1 As Double
  Dim dblStation2 As Double
  Dim intPoint As Integer
'
' Go to row with top of the bank and search for points in bank profile
' surrounding the water surface elevation
'
  intPoint = 0
  Do While (cintMaxNumberofPoints > intPoint + 1)
    intPoint = intPoint + 1
    dblElevation1 = adblZ(intPoint)
    dblElevation2 = adblZ(intPoint + 1)
    If (dblElevation2 <= dblWaterElevation) Then Exit Do
  Loop
  dblStation1 = adblX(intPoint)
  dblStation2 = adblX(intPoint + 1)
'
' Check for bankfull or over-bankfull
'
  If (dblWaterElevation > dblElevation1) Then
    dblWaterBankIntersectStation = adblX(2)
  Else
'
' Calculate station of intersection point
'
    dblWaterBankIntersectStation = dblStation1 + (dblStation2 - dblStation1) _
                  * (dblWaterElevation - dblElevation1) / (dblElevation2 - dblElevation1)
  End If
'
' Set row and column number of result and and write it to the active cell
'
  dblMinElevation = 99999999
  For intPoint = 1 To cintMaxNumberofPoints
    If (dblMinElevation > adblZ(intPoint)) Then
      dblMinElevation = adblZ(intPoint)
    End If
  Next intPoint
  If (dblMinElevation > dblWaterElevation) Then
    Worksheets("Calculations").Cells(31, 16).Value = ""
    Worksheets("Calculations").Cells(32, 16).Value = ""
    Worksheets("Calculations").Cells(31, 17).Value = ""
    Worksheets("Calculations").Cells(32, 17).Value = ""
  Else
    Worksheets("Calculations").Cells(31, 16).Value = dblWaterBankIntersectStation
    Worksheets("Calculations").Cells(32, 16).Value = adblX(cintMaxNumberofPoints)
    Worksheets("Calculations").Cells(31, 17).Value = dblWaterElevation
    Worksheets("Calculations").Cells(32, 17).Value = dblWaterElevation
  End If
End Sub

Sub SetWaterForce(intIteration As Integer, intNumberofLayers As Integer, adblX() As Double, adblZ() As Double, _
                dblBaseStation As Double, dblBaseElevation As Double, dblWaterElevation As Double, _
                dblWaterBankIntersectStation As Double, dblConfiningForce() As Double, dblConfiningAngle() As Double)
'
' This procedure calculates the magnitude of the confining force and its
' orientation on each soil layer.
'
' Variable declarations
'
    Dim dblBottomElevation As Double
    Dim dblBottomPressure As Double
    Dim dblBottomStation As Double
    Dim dblDeltaX As Double
    Dim dblDeltaZ As Double
    Dim dblElevation1 As Double
    Dim dblElevation2 As Double
    Dim dblHorizontalComponent As Double
    Dim dblPressure As Double
    Dim dblStation1 As Double
    Dim dblStation2 As Double
    Dim dblTopElevation As Double
    Dim dblTopPressure As Double
    Dim dblTopStation As Double
    Dim dblVerticalComponent As Double
    Dim intFirstWetLayer As Integer
    Dim intLayer As Integer
    Dim intPoint As Integer
'
' Check if water surface elevation is below the base of the failure surface
'
    If (dblWaterElevation <= dblBaseElevation) Then
'
' Water surface elevation is below base of slip surface.  Set all confining
' forces and their angles to zero
'
      For intLayer = 1 To cintNumberofLayers
        dblConfiningForce(intLayer) = 0
        dblConfiningAngle(intLayer) = 0
        Worksheets("Calculations").Cells(69, 1 + intLayer).Value = dblConfiningForce(intLayer)   ' Force
        Worksheets("Calculations").Cells(70, 1 + intLayer).Value = dblConfiningAngle(intLayer)   ' Angle
      Next intLayer
    Else
'
' Loop over each layer to determine confining force and angle
'
' First find point on bank just above slip surface
'
      intPoint = 1
      Do While (cintMaxNumberofPoints - 1 > intPoint)  ' Don't move past point V
        If (adblZ(intPoint) < dblBaseElevation) Then Exit Do
        intPoint = intPoint + 1
      Loop
      intPoint = intPoint - 1
'
      For intLayer = intNumberofLayers To 1 Step -1
'
' Initialize confining force components to zero
'
        dblHorizontalComponent = 0
        dblVerticalComponent = 0
'
' Set top and bottom coordinates of soil layer
'
        If (intLayer = intNumberofLayers) Then
' Base of failure surface
          dblBottomElevation = dblBaseElevation
          dblBottomStation = dblBaseStation
        Else
' Bottom of soil layer
          dblBottomElevation = Worksheets("Calculations").Cells(5 + intLayer, 17).Value
          dblBottomStation = Worksheets("Calculations").Cells(5 + intLayer, 16).Value
        End If
        If (dblWaterElevation < Worksheets("Calculations").Cells(28 + intLayer, 4).Value) Then
' Intersect of water surface and bank profile
          dblTopElevation = dblWaterElevation
          dblTopStation = dblWaterBankIntersectStation
        Else
' Top of soil layer
          dblTopElevation = Worksheets("Calculations").Cells(4 + intLayer, 17).Value
          dblTopStation = Worksheets("Calculations").Cells(4 + intLayer, 16).Value
        End If
'
' Loop over bank profile to compute confining force
'
        dblElevation1 = dblBottomElevation
        dblStation1 = dblBottomStation
        dblTopPressure = 9.807 * (dblWaterElevation - dblElevation1)
        If (intPoint > 1) Then
          Do While (adblZ(intPoint) < dblTopElevation)
            dblElevation2 = dblElevation1
            dblStation2 = dblStation1
            dblBottomPressure = dblTopPressure
            dblElevation1 = adblZ(intPoint)
            dblStation1 = adblX(intPoint)
            dblTopPressure = 9.807 * (dblWaterElevation - dblElevation1)
            dblDeltaX = dblStation2 - dblStation1
            dblDeltaZ = dblElevation1 - dblElevation2
            dblPressure = 0.5 * (dblTopPressure + dblBottomPressure)
            dblHorizontalComponent = dblHorizontalComponent + dblPressure * dblDeltaZ
            dblVerticalComponent = dblVerticalComponent + dblPressure * dblDeltaX
            intPoint = intPoint - 1
          Loop
        End If
'
' Add last segment
'
        dblElevation2 = dblElevation1
        dblStation2 = dblStation1
        dblBottomPressure = dblTopPressure
        dblElevation1 = dblTopElevation
        dblStation1 = dblTopStation
        dblTopPressure = 9.807 * (dblWaterElevation - dblElevation1)
        dblDeltaX = dblStation2 - dblStation1
        dblDeltaZ = dblElevation1 - dblElevation2
        dblPressure = 0.5 * (dblTopPressure + dblBottomPressure)
        dblHorizontalComponent = dblHorizontalComponent + dblPressure * dblDeltaZ
        dblVerticalComponent = dblVerticalComponent + dblPressure * dblDeltaX
'
' Compute confining force and its angle, and write to spreadsheet
'
        dblConfiningForce(intLayer) = Sqr(dblHorizontalComponent ^ 2 + dblVerticalComponent ^ 2)
        If (dblVerticalComponent = 0) Then
          dblConfiningAngle(intLayer) = 0.5 * cdblPi
        Else
          dblConfiningAngle(intLayer) = Atn(dblHorizontalComponent / dblVerticalComponent)
          If (dblConfiningAngle(intLayer) < 0) Then _
                dblConfiningAngle(intLayer) = dblConfiningAngle(intLayer) + cdblPi
        End If
'
        Worksheets("Calculations").Cells(69, 1 + intLayer).Value = dblConfiningForce(intLayer)
        Worksheets("Calculations").Cells(70, 1 + intLayer).Value = dblConfiningAngle(intLayer) * 180 / cdblPi
'
' If top of soil layer is above the water surface elevation exit
' the for loop.
'
        If (dblWaterElevation < Worksheets("Calculations").Cells(28 + intLayer, 4).Value) Then Exit For
'
      Next intLayer
'
' Set forces and their angles to zero for layers above the water surface
' or below the base of the slip surface.
'
      intFirstWetLayer = intLayer - 1
      For intLayer = 1 To intFirstWetLayer
        dblConfiningForce(intLayer) = 0
        dblConfiningAngle(intLayer) = 0
        Worksheets("Calculations").Cells(69, 1 + intLayer).Value = dblConfiningForce(intLayer)   ' Force
        Worksheets("Calculations").Cells(70, 1 + intLayer).Value = dblConfiningAngle(intLayer)   ' Angle
      Next intLayer
      For intLayer = intNumberofLayers + 1 To cintNumberofLayers
        dblConfiningForce(intLayer) = 0
        dblConfiningAngle(intLayer) = 0
        Worksheets("Calculations").Cells(69, 1 + intLayer).Value = dblConfiningForce(intLayer)   ' Force
        Worksheets("Calculations").Cells(70, 1 + intLayer).Value = dblConfiningAngle(intLayer)   ' Angle
      Next intLayer
'
    End If
End Sub

Function NumberOfLayersInBank(dblBaseElevation As Double) As Integer
'
' Determine how many layers span the failure block
'
  Dim intLayer As Integer
  Dim dblTopElevation As Double
  
  NumberOfLayersInBank = 0
  For intLayer = 1 To cintNumberofLayers
    dblTopElevation = Worksheets("Calculations").Cells(28 + intLayer, 4).Value
    If (dblTopElevation <= dblBaseElevation) Then
      Exit For
    Else
      NumberOfLayersInBank = NumberOfLayersInBank + 1
    End If
  Next intLayer
End Function

Function PolygonArea(dblPolygonX() As Double, dblPolygonY() As Double, _
                                            intNumberofVertices As Integer) As Double
'
' PolygonArea Macro
' Macro developed 11/10/2000 by Eddy Langendoen
'
    Dim intVertex As Integer
    Dim intNextVertex As Integer
'
    PolygonArea = 0
    For intVertex = 1 To intNumberofVertices
      intNextVertex = intVertex + 1
      If (intNextVertex > intNumberofVertices) _
            Then intNextVertex = intNextVertex - intNumberofVertices
      PolygonArea = PolygonArea + dblPolygonX(intVertex) * dblPolygonY(intNextVertex) _
                                   - dblPolygonY(intVertex) * dblPolygonX(intNextVertex)
    Next intVertex
'
    PolygonArea = 0.5 * PolygonArea
    If (PolygonArea < 0) Then PolygonArea = -PolygonArea

End Function
